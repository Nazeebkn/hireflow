from django.db.models import Q

from company_app.models import (
    Company,
    ApprovalStatus,
)


class CompanyListRepository:

    @staticmethod
    def get_all_companies(
        search=None,
        status=None,
        page=1,
    ):

        queryset = (
            Company.objects
            .select_related("user")
            .filter(
                approval_status=ApprovalStatus.APPROVED
            )
            .order_by("-created_at")
        )


        if search:
            queryset = queryset.filter(
                Q(company_name__icontains=search)
                |
                Q(industry__icontains=search)
                |
                Q(contact_person__icontains=search)
            )


        if status:

            status = status.upper()

            if status == "ACTIVE":

                queryset = queryset.filter(
                    user__is_active=True
                )

            elif status == "SUSPENDED":

                queryset = queryset.filter(
                    user__is_active=False
                )


        page_size = 10

        start = (page - 1) * page_size
        end = start + page_size

        return queryset[start:end]