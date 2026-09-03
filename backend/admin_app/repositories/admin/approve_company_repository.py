from django.shortcuts import get_object_or_404

from company_app.models import Company


class ApproveCompanyRepository:

    @staticmethod
    def get_company(company_id):

        return get_object_or_404(
            Company,
            id=company_id,
        )

    @staticmethod
    def approve_company(company):

        company.approval_status = "APPROVED"

        company.save(
            update_fields=[
                "approval_status",
            ]
        )

        return company