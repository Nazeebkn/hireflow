from admin_app.repositories.admin.user_status_repository import (
    UserStatusRepository,
)


class UserStatusService:

    @staticmethod
    def update_user_status(
        user_id,
        is_active,
    ):

        return (
            UserStatusRepository.update_user_status(
                user_id,
                is_active,
            )
        )