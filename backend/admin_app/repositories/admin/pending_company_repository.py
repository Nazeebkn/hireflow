from company_app.models import (
    Company,
    ApprovalStatus,
)


class PendingCompanyRepository:

    @staticmethod
    def get_pending_companies():

        return (
            Company.objects.filter(
                approval_status=ApprovalStatus.PENDING
            )
            .select_related("user")
            .order_by("-created_at")
        )