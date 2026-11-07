from django.conf import settings
from django.core.mail import send_mail

from users.models import User
from admin_app.repositories.admin.user_status_repository import (
    UserStatusRepository,
)


class UserStatusService:

    @staticmethod
    def update_user_status(
        user_id,
        is_active,
        reason=None,
    ):

        user = User.objects.get(id=user_id)

        was_active = user.is_active

        updated_user = UserStatusRepository.update_user_status(
            user_id,
            is_active,
            reason,
        )

        if updated_user.role not in [
            User.UserRole.COMPANY,
            User.UserRole.CANDIDATE,
        ]:
            return updated_user

        # Suspension email
        if was_active and not is_active:

            send_mail(
                subject="HireFlow - Account Suspended",
                message=(
                    f"Hello {updated_user.email},\n\n"
                    "Your HireFlow account has been suspended "
                    "by the administrator.\n\n"
                    f"Reason for suspension:\n{reason}\n\n"
                    "Please contact HireFlow support for further assistance.\n\n"
                    "Regards,\n"
                    "HireFlow Team"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[updated_user.email],
                fail_silently=False,
            )

        # Activation email
        elif not was_active and is_active:

            send_mail(
                subject="HireFlow - Account Activated",
                message=(
                    f"Hello {updated_user.email},\n\n"
                    "Good news! Your HireFlow account has been "
                    "activated by the administrator.\n\n"
                    "You can now log in and access your account.\n\n"
                    "Regards,\n"
                    "HireFlow Team"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[updated_user.email],
                fail_silently=False,
            )

        return updated_user