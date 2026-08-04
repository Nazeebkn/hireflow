from admin_app.repositories.admin.pending_company_repository import (
    PendingCompanyRepository,
)


class PendingCompanyService:

    @staticmethod
    def get_pending_companies():

        return (
            PendingCompanyRepository.get_pending_companies()
        )