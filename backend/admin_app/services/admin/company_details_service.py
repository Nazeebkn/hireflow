from admin_app.repositories.admin.company_details_repository import (
    CompanyDetailsRepository,
)


class CompanyDetailsService:

    @staticmethod
    def get_company(company_id):

        return CompanyDetailsRepository.get_company(
            company_id
        )