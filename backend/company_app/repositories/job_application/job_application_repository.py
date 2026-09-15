from company_app.models import Job, JobApplication


class JobApplicationRepository:

    @staticmethod
    def get_published_job(job_id):
        return Job.objects.filter(
            id=job_id,
            status=Job.JobStatus.PUBLISHED,
        ).first()

    @staticmethod
    def create_application(
        candidate,
        job,
        submitted_resume,
    ):
        return JobApplication.objects.create(
            candidate=candidate,
            job=job,
            submitted_resume=submitted_resume,
        )

    @staticmethod
    def get_application(candidate, job):
        return JobApplication.objects.filter(
            candidate=candidate,
            job=job,
        ).first()

    @staticmethod
    def get_candidate_applications(candidate):
        return (
            JobApplication.objects
            .filter(candidate=candidate)
            .select_related(
                "job",
                "job__company",
            )
        )

    @staticmethod
    def get_application_by_id(application_id):
        return (
            JobApplication.objects
            .filter(id=application_id)
            .select_related(
                "job",
                "job__company",
                "candidate",
            )
            .first()
        )

    # =====================================================
    # COMPANY - GET APPLICATIONS FOR A SPECIFIC JOB
    # =====================================================

    @staticmethod
    def get_job_applications(job):
        return (
            JobApplication.objects
            .filter(job=job)
            .select_related(
                "candidate",
                "job",
                "job__company",
            )
            .order_by("-applied_at")
        )

    # =====================================================
    # COMPANY - GET JOB
    # =====================================================

    @staticmethod
    def get_job_by_id(job_id):
        return (
            Job.objects
            .filter(id=job_id)
            .select_related("company")
            .first()
        )