from company_app.repositories.notification.notification_repository import (
    CompanyNotificationRepository,
)


class CompanyNotificationService:

    @staticmethod
    def get_user_notifications(user):
        return CompanyNotificationRepository.get_user_notifications(
            user=user
        )

    @staticmethod
    def mark_as_read(user, notification_id):
        notification = (
            CompanyNotificationRepository
            .get_notification_by_user(
                notification_id=notification_id,
                user=user,
            )
        )

        if not notification:
            return None

        return CompanyNotificationRepository.mark_as_read(
            notification
        )

    @staticmethod
    def mark_all_as_read(user):
        CompanyNotificationRepository.mark_all_as_read(
            user=user
        )

    @staticmethod
    def get_unread_count(user):
        return CompanyNotificationRepository.get_unread_count(
            user=user
        )

    @staticmethod
    def delete_all_notifications(user):
        CompanyNotificationRepository.delete_all_notifications(
            user=user
        )

    @staticmethod
    def get_notification_by_user(
        notification_id,
        user,
    ):
        return (
            CompanyNotificationRepository
            .get_notification_by_user(
                notification_id=notification_id,
                user=user,
            )
        )

    @staticmethod
    def delete_notification(notification):
        return CompanyNotificationRepository.delete_notification(
            notification=notification
        )