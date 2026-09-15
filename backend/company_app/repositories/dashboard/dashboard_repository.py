from datetime import timedelta

from django.utils import timezone

from company_app.models import Job, JobApplication


class DashboardRepository:

    @staticmethod
    def get_job_counts(company):
        total_jobs = Job.objects.filter(
            company=company
        ).count()

        draft_jobs = Job.objects.filter(
            company=company,
            status=Job.JobStatus.DRAFT
        ).count()

        published_jobs = Job.objects.filter(
            company=company,
            status=Job.JobStatus.PUBLISHED
        ).count()

        closed_jobs = Job.objects.filter(
            company=company,
            status=Job.JobStatus.CLOSED
        ).count()

        total_applications = JobApplication.objects.filter(
            job__company=company
        ).count()

        active_jobs = Job.objects.filter(
            company=company,
            status=Job.JobStatus.PUBLISHED
        ).count()

        return {
            "total_jobs": total_jobs,
            "draft_jobs": draft_jobs,
            "published_jobs": published_jobs,
            "closed_jobs": closed_jobs,
            "total_applications": total_applications,
            "active_jobs": active_jobs,
        }

    @staticmethod
    def get_recent_applications(company):
        return (
            JobApplication.objects
            .filter(job__company=company)
            .select_related(
                "candidate",
                "job",
                "job__company",
            )
            .order_by("-applied_at")[:5]
        )

    @staticmethod
    def get_jobs_requiring_attention(company):
        today = timezone.localdate()
        deadline_limit = today + timedelta(days=7)

        return (
            Job.objects
            .filter(company=company)
            .filter(
                status=Job.JobStatus.DRAFT
            )
            .order_by("-updated_at")[:5]
        ), (
            Job.objects
            .filter(
                company=company,
                status=Job.JobStatus.PUBLISHED,
                application_deadline__isnull=False,
                application_deadline__gte=today,
                application_deadline__lte=deadline_limit,
            )
            .order_by("application_deadline")[:5]
        )

    @staticmethod
    def get_recent_activity(company):
        return (
            Job.objects
            .filter(company=company)
            .order_by("-updated_at")[:10]
        )