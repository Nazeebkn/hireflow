from rest_framework.exceptions import ValidationError

from admin_app.repositories.admin.reject_company_repository import (
    RejectCompanyRepository,
)


class RejectCompanyService:

    @staticmethod
    def reject_company(
        company_id,
        rejection_reason,
    ):

        company = RejectCompanyRepository.get_company(
            company_id
        )

        if company.approval_status != "PENDING":
            raise ValidationError(
                {
                    "message":
                    "Only pending companies can be rejected."
                }
            )

        return RejectCompanyRepository.reject_company(
            company,
            rejection_reason,
        )