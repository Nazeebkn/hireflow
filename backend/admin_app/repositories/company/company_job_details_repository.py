from django.shortcuts import get_object_or_404

from company_app.models import Company, Job, JobApplication


class CompanyJobDetailsRepository:

    @staticmethod
    def get_company_job(company_id, job_id):

        company = get_object_or_404(
            Company.objects.select_related("user"),
            id=company_id,
        )

        job = get_object_or_404(
            Job.objects
            .select_related("company")
            .filter(
                id=job_id,
                company=company,
            )
        )

        return job

    @staticmethod
    def get_job_applications(job):

        return (
            JobApplication.objects
            .filter(job=job)
            .select_related(
                "candidate",
                "job",
                "job__company",
                "ai_interview",
            )
            .prefetch_related(
                "resume_screening",
                "ai_interview__candidate_report",
            )
            .order_by("-applied_at")
        )