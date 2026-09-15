from django.db.models import Count

from company_app.models import Job


class JobRepository:

    @staticmethod
    def create_job(company, validated_data):
        return Job.objects.create(
            company=company,
            **validated_data
        )

    @staticmethod
    def get_job_by_id(job_id):
        return Job.objects.filter(
            id=job_id
        ).first()

    @staticmethod
    def get_company_jobs(company):
        return (
            Job.objects
            .filter(company=company)
            .annotate(
                application_count=Count("applications")
            )
            .order_by("-created_at")
        )

    @staticmethod
    def update_job(job, validated_data):
        for field, value in validated_data.items():
            setattr(job, field, value)

        job.save()

        return job

    @staticmethod
    def delete_job(job):
        job.delete()