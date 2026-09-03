from django.shortcuts import get_object_or_404

from company_app.models import Company


class RejectCompanyRepository:

    @staticmethod
    def get_company(company_id):

        return get_object_or_404(
            Company,
            id=company_id,
        )

    @staticmethod
    def reject_company(
        company,
        rejection_reason,
    ):

        company.approval_status = "REJECTED"
        company.rejection_reason = rejection_reason

        company.save(
            update_fields=[
                "approval_status",
                "rejection_reason",
            ]
        )

        return company