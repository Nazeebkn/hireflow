from django.shortcuts import get_object_or_404

from company_app.models import Company


class CompanyDetailsRepository:

    @staticmethod
    def get_company(company_id):

        return get_object_or_404(
            Company.objects.select_related("user"),
            id=company_id,
        )