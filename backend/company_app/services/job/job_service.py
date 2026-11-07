from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from company_app.models import JobQuestion
from company_app.repositories.job.job_repository import JobRepository
from users.models import User

from candidate_app.models import Notification
from admin_app.services.notification.notification_service import (
    AdminNotificationService,
)

class JobService:

    @staticmethod
    def save_job_questions(job, questions):
        job.questions.all().delete()

        JobQuestion.objects.bulk_create([
            JobQuestion(
                job=job,
                question_text=question["question_text"],
                question_type=question["question_type"],
                options=question.get("options", []),
                display_order=question.get("display_order", index),
            )
            for index, question in enumerate(questions)
        ])
    
    
    
    @staticmethod
    @transaction.atomic
    def create_job(user, validated_data):

        if user.role != User.UserRole.COMPANY:
            raise ValidationError(
                "Only company users can create jobs."
            )

        company = getattr(user, "company_profile", None)

        if not company:
            raise ValidationError(
                "Company profile not found."
            )

        if company.approval_status != "APPROVED":
            raise ValidationError(
                "Only approved companies can create job vacancies."
            )

        questions = validated_data.pop("questions", [])

        job = JobRepository.create_job(
            company,
            validated_data
        )

        JobService.save_job_questions(job, questions)

        AdminNotificationService.notify_admins(
            notification_type=Notification.NotificationType.NEW_JOB_CREATED,
            title="New Job Created",
            message=(
                f"New job '{job.title}' was created by "
                f"{company.company_name}."
            ),
        )

        return job


    @staticmethod
    @transaction.atomic
    def update_job(user, job, validated_data):

        if job.company.user != user:
            raise ValidationError(
                "You are not authorized to update this job."
            )

        if job.status == job.JobStatus.CLOSED:
            raise ValidationError(
                "Closed jobs cannot be edited."
            )

        questions = validated_data.pop("questions", None)

        updated_job = JobRepository.update_job(
            job,
            validated_data
        )

        if questions is not None:
            JobService.save_job_questions(
                updated_job,
                questions
            )

        return updated_job
    
    
    

    @staticmethod
    def publish_job(user, job):

        if job.company.user != user:
            raise ValidationError(
                "You are not authorized to publish this job."
            )

        if job.status != job.JobStatus.DRAFT:
            raise ValidationError(
                "Only draft jobs can be published."
            )

        job.status = job.JobStatus.PUBLISHED
        job.published_at = timezone.now()

        job.save(
            update_fields=[
                "status",
                "published_at",
                "updated_at",
            ]
        )

        return job

    @staticmethod
    def close_job(user, job):

        if job.company.user != user:
            raise ValidationError(
                "You are not authorized to close this job."
            )

        if job.status != job.JobStatus.PUBLISHED:
            raise ValidationError(
                "Only published jobs can be closed."
            )

        job.status = job.JobStatus.CLOSED
        job.closed_at = timezone.now()

        job.save(
            update_fields=[
                "status",
                "closed_at",
                "updated_at",
            ]
        )

        return job

    @staticmethod
    def get_company_jobs(user):

        if user.role != User.UserRole.COMPANY:
            raise ValidationError(
                "Only company users can access company jobs."
            )

        company = getattr(user, "company_profile", None)

        if not company:
            raise ValidationError(
                "Company profile not found."
            )

        return JobRepository.get_company_jobs(company)