from admin_app.repositories.company.company_job_details_repository import (
    CompanyJobDetailsRepository,
)


class CompanyJobDetailsService:

    @staticmethod
    def get_company_job_details(
        company_id,
        job_id,
    ):

        job = (
            CompanyJobDetailsRepository
            .get_company_job(
                company_id=company_id,
                job_id=job_id,
            )
        )

        applications = (
            CompanyJobDetailsRepository
            .get_job_applications(job)
        )

        return job, applications