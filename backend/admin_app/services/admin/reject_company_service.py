from admin_app.repositories.admin.reject_company_repository import (
    RejectCompanyRepository,
)


class RejectCompanyService:

    @staticmethod
    def reject_company(
        company_id,
        rejection_reason,
    ):

        return (
            RejectCompanyRepository.reject_company(
                company_id,
                rejection_reason,
            )
        )