from django.shortcuts import get_object_or_404

from company_app.models import (
    Company,
    ApprovalStatus,
)


class ApproveCompanyRepository:

    @staticmethod
    def approve_company(company_id):

        company = get_object_or_404(
            Company,
            id=company_id,
        )

        company.approval_status = (
            ApprovalStatus.APPROVED
        )

        company.save()

        return company