import threading
from decimal import Decimal, InvalidOperation

from django.db import transaction, IntegrityError

from rest_framework.exceptions import NotFound, ValidationError

from candidate_app.services.ai.resume_screening_task import (
    run_resume_screening,
)

from company_app.models import JobQuestion, ApplicationAnswer

from company_app.repositories.job_application.job_application_repository import (
    JobApplicationRepository,
)

from candidate_app.models import Notification

from candidate_app.services.notification.notification_service import (
    NotificationService,
)

from admin_app.services.notification.notification_service import (
    AdminNotificationService,
)



class JobApplicationService:
    
    
    @staticmethod
    def validate_application_answers(job, submitted_answers):

        if not isinstance(submitted_answers, list):
            raise ValidationError({
                "answers": "Answers must be provided as a list."
            })

        questions = list(
            job.questions.all().order_by("display_order", "id")
        )

        if not questions:
            if submitted_answers:
                raise ValidationError({
                    "answers": "This job has no application questions."
                })
            return []

        if len(submitted_answers) != len(questions):
            raise ValidationError({
                "answers": "Please answer all application questions."
            })

        question_map = {question.id: question for question in questions}
        submitted_ids = set()
        validated_answers = []

        for item in submitted_answers:

            if not isinstance(item, dict):
                raise ValidationError({
                    "answers": "Invalid answer format."
                })

            question_id = item.get("question_id")
            answer = item.get("answer")

            if question_id not in question_map:
                raise ValidationError({
                    "answers": "Invalid question ID."
                })

            if question_id in submitted_ids:
                raise ValidationError({
                    "answers": "Duplicate question answers are not allowed."
                })

            submitted_ids.add(question_id)
            question = question_map[question_id]

            if question.question_type == JobQuestion.QuestionType.SHORT_TEXT:

                if not isinstance(answer, str) or not answer.strip():
                    raise ValidationError({
                        "answers": f"Answer required for: {question.question_text}"
                    })

                answer = answer.strip()

            elif question.question_type == JobQuestion.QuestionType.YES_NO:

                if not isinstance(answer, bool):
                    raise ValidationError({
                        "answers": f"Select Yes or No for: {question.question_text}"
                    })

            elif question.question_type == JobQuestion.QuestionType.NUMBER:

                if isinstance(answer, bool) or not isinstance(
                    answer, (int, float, str)
                ):
                    raise ValidationError({
                        "answers": f"Enter a valid number for: {question.question_text}"
                    })

                try:
                    number = Decimal(str(answer))

                    if not number.is_finite():
                        raise InvalidOperation

                    answer = str(number)

                except (InvalidOperation, ValueError):
                    raise ValidationError({
                        "answers": f"Enter a valid number for: {question.question_text}"
                    })

            elif question.question_type == JobQuestion.QuestionType.MULTIPLE_CHOICE:

                if (
                    not isinstance(answer, list)
                    or not answer
                    or not all(isinstance(option, str) for option in answer)
                ):
                    raise ValidationError({
                        "answers": f"Select at least one option for: {question.question_text}"
                    })

                if len(set(answer)) != len(answer) or not all(
                    option in question.options for option in answer
                ):
                    raise ValidationError({
                        "answers": f"Invalid options selected for: {question.question_text}"
                    })

            validated_answers.append({
                "question": question,
                "answer": answer,
            })

        return validated_answers



    @staticmethod
    @transaction.atomic
    def apply_for_job(candidate, job_id, answers=None):

        if not candidate:
            raise NotFound("Candidate profile not found.")

        if not candidate.resume:
            raise ValidationError(
                "Please upload your resume before applying for a job."
            )

        job = JobApplicationRepository.get_published_job(job_id)

        if not job:
            raise NotFound(
                "Job not found or is not currently published."
            )

        existing_application = JobApplicationRepository.get_application(
            candidate,
            job,
        )

        if existing_application:
            raise ValidationError(
                "You have already applied for this job."
            )

        validated_answers = JobApplicationService.validate_application_answers(
            job,
            answers if answers is not None else [],
        )

        try:
            with transaction.atomic():
                application = JobApplicationRepository.create_application(
                    candidate=candidate,
                    job=job,
                    submitted_resume=candidate.resume,
                )

        except IntegrityError:
            raise ValidationError(
                "You have already applied for this job."
            )

        ApplicationAnswer.objects.bulk_create([
            ApplicationAnswer(
                application=application,
                question=item["question"],
                question_text_snapshot=item["question"].question_text,
                question_type_snapshot=item["question"].question_type,
                options_snapshot=item["question"].options,
                answer=item["answer"],
            )
            for item in validated_answers
        ])

        application.status = (
            application.ApplicationStatus.RESUME_SCREENING
        )

        application.save(
            update_fields=["status", "updated_at"]
        )

        NotificationService.create_notification(
            user=job.company.user,
            notification_type=Notification.NotificationType.NEW_CANDIDATE_APPLIED,
            title="New Candidate Applied",
            message=f"New candidate applied for {job.title}.",
        )

        AdminNotificationService.notify_admins(
            notification_type=Notification.NotificationType.NEW_JOB_APPLICATION,
            title="New Job Application",
            message=f"A candidate has applied for the {job.title} position.",
        )

        transaction.on_commit(
            lambda: threading.Thread(
                target=run_resume_screening,
                args=(application.id,),
                daemon=True,
            ).start()
        )

        return application
    
    
    

    @staticmethod
    def get_candidate_applications(candidate):

        if not candidate:
            raise NotFound(
                "Candidate profile not found."
            )

        return (
            JobApplicationRepository.get_candidate_applications(
                candidate
            )
        )

    @staticmethod
    def get_application(
        candidate,
        application_id,
    ):

        if not candidate:
            raise NotFound(
                "Candidate profile not found."
            )

        application = (
            JobApplicationRepository.get_application_by_id(
                application_id
            )
        )

        if not application:
            raise NotFound(
                "Application not found."
            )

        # Authorization check
        if application.candidate_id != candidate.id:
            raise ValidationError(
                "You are not authorized to view this application."
            )

        return application

    # =====================================================
    # COMPANY - GET JOB APPLICATIONS
    # =====================================================

    @staticmethod
    def get_job_applications(
        company,
        job_id,
    ):

        if not company:
            raise NotFound(
                "Company profile not found."
            )

        job = JobApplicationRepository.get_job_by_id(
            job_id
        )

        if not job:
            raise NotFound(
                "Job not found."
            )

        # Authorization check
        if job.company_id != company.id:
            raise ValidationError(
                "You are not authorized to view applications for this job."
            )

        applications = (
            JobApplicationRepository.get_job_applications(
                job
            )
        )

        return job, applications

    @staticmethod
    def get_application_for_company(
        company,
        application_id,
    ):

        if not company:
            raise NotFound(
                "Company profile not found."
            )

        application = (
            JobApplicationRepository.get_application_by_id_for_company(
                company,
                application_id,
            )
        )

        if not application:
            raise NotFound(
                "Application not found or you do not have access to this application."
            )

        return application