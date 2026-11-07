from django.shortcuts import get_object_or_404

from users.models import User


class UserStatusRepository:

    @staticmethod
    def update_user_status(
        user_id,
        is_active,
        reason=None,
    ):

        user = get_object_or_404(
            User,
            id=user_id,
        )

        user.is_active = is_active

        update_fields = ["is_active"]

        if not is_active:
            user.suspension_reason = reason
            update_fields.append("suspension_reason")

        user.save(update_fields=update_fields)

        return user