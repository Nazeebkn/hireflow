from django.shortcuts import get_object_or_404

from users.models import User


class UserStatusRepository:

    @staticmethod
    def update_user_status(
        user_id,
        is_active,
    ):

        user = get_object_or_404(
            User,
            id=user_id,
        )

        user.is_active = is_active

        user.save(
            update_fields=[
                "is_active",
            ]
        )

        return user