from admin_app.repositories.admin.approve_company_repository import (
    ApproveCompanyRepository,
)


class ApproveCompanyService:

    @staticmethod
    def approve_company(company_id):

        return (
            ApproveCompanyRepository.approve_company(
                company_id
            )
        )