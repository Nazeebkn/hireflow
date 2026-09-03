from rest_framework.exceptions import ValidationError

from admin_app.repositories.admin.approve_company_repository import (
    ApproveCompanyRepository,
)


class ApproveCompanyService:

    @staticmethod
    def approve_company(company_id):

        company = ApproveCompanyRepository.get_company(
            company_id
        )

        if company.approval_status != "PENDING":
            raise ValidationError(
                {
                    "message":
                    "Only pending companies can be approved."
                }
            )

        return ApproveCompanyRepository.approve_company(
            company
        )