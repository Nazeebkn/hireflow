
from django.conf import settings
from django.core.mail import send_mail
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

        approved_company = ApproveCompanyRepository.approve_company(
            company
        )

        send_mail(
            subject="Your Company Has Been Approved - HireFlow",
            message=(
                f"Hello {approved_company.user.email},\n\n"
                "Good news! Your company has been approved "
                "by the HireFlow admin team.\n\n"
                "You can now log in to HireFlow and start "
                "creating jobs.\n\n"
                "Thank you for choosing HireFlow!"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[approved_company.user.email],
            fail_silently=False,
        )

        return approved_company



