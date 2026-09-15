from django.core.exceptions import ValidationError
from django.utils import timezone

from company_app.repositories.job.job_repository import JobRepository
from users.models import User


class JobService:

    @staticmethod
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

        return JobRepository.create_job(
            company,
            validated_data
        )

    @staticmethod
    def update_job(user, job, validated_data):

        if job.company.user != user:
            raise ValidationError(
                "You are not authorized to update this job."
            )

        if job.status == job.JobStatus.CLOSED:
            raise ValidationError(
                "Closed jobs cannot be edited."
            )

        return JobRepository.update_job(
            job,
            validated_data
        )

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