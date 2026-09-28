from company_app.models import Job


class ActiveJobsRepository:

    @staticmethod
    def get_active_jobs_count():
        return Job.objects.filter(
            status=Job.JobStatus.PUBLISHED
        ).count()