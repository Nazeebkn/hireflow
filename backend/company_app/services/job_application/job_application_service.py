import threading

from rest_framework.exceptions import NotFound, ValidationError

from company_app.repositories.job_application.job_application_repository import (
    JobApplicationRepository,
)




class JobApplicationService:

    @staticmethod
    def apply_for_job(candidate, job_id):

        if not candidate:
            raise NotFound(
                "Candidate profile not found."
            )

        if not candidate.resume:
            raise ValidationError(
                "Please upload your resume before applying for a job."
            )

        job = JobApplicationRepository.get_published_job(
            job_id
        )

        if not job:
            raise NotFound(
                "Job not found or is not currently published."
            )

        existing_application = (
            JobApplicationRepository.get_application(
                candidate,
                job,
            )
        )

        if existing_application:
            raise ValidationError(
                "You have already applied for this job."
            )

        application = (
            JobApplicationRepository.create_application(
                candidate=candidate,
                job=job,
                submitted_resume=candidate.resume,
            )
        )

        application.status = (
            application.ApplicationStatus.RESUME_SCREENING
        )

        application.save(
            update_fields=["status", "updated_at"]
        )

        # Start AI resume screening in background
        threading.Thread(
            target=run_resume_screening,
            args=(application.id,),
            daemon=True,
        ).start()

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