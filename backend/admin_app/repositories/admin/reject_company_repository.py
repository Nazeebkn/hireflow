from django.shortcuts import get_object_or_404

from company_app.models import (
    Company,
    ApprovalStatus,
)


class RejectCompanyRepository:

    @staticmethod
    def reject_company(
        company_id,
        rejection_reason,
    ):

        company = get_object_or_404(
            Company,
            id=company_id,
        )

        company.approval_status = (
            ApprovalStatus.REJECTED
        )

        company.rejection_reason = (
            rejection_reason
        )

        company.save(
            update_fields=[
                "approval_status",
                "rejection_reason",
            ]
        )

        return company