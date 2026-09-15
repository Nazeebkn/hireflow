from django.db.models import Q

from company_app.models import Job


class CandidateJobRepository:

    @staticmethod
    def get_published_jobs(filters=None):
        filters = filters or {}

        queryset = (
            Job.objects
            .filter(status=Job.JobStatus.PUBLISHED)
            .select_related("company")
        )

        # Search
        search = filters.get("search")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(skills__icontains=search)
                | Q(company__company_name__icontains=search)
            )

        # Location
        location = filters.get("location")

        if location:
            queryset = queryset.filter(
                location__icontains=location
            )

        # Work Mode
        work_mode = filters.get("work_mode")

        if work_mode:
            queryset = queryset.filter(
                work_mode=work_mode
            )

        # Employment Type
        employment_type = filters.get("employment_type")

        if employment_type:
            queryset = queryset.filter(
                employment_type=employment_type
            )

        # Minimum Salary
        min_salary = filters.get("min_salary")

        if min_salary:
            queryset = queryset.filter(
                maximum_salary__gte=min_salary
            )

        # Maximum Salary
        max_salary = filters.get("max_salary")

        if max_salary:
            queryset = queryset.filter(
                minimum_salary__lte=max_salary
            )

        # Sorting
        sort = filters.get("sort", "newest")

        if sort == "highest_salary":
            queryset = queryset.order_by(
                "-maximum_salary",
                "-published_at"
            )

        elif sort == "oldest":
            queryset = queryset.order_by(
                "published_at"
            )

        else:
            # Default = Newest
            queryset = queryset.order_by(
                "-published_at"
            )

        return queryset

    @staticmethod
    def get_published_job_by_id(job_id):
        return (
            Job.objects
            .filter(
                id=job_id,
                status=Job.JobStatus.PUBLISHED
            )
            .select_related("company")
            .first()
        )