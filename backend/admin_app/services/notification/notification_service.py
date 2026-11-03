from admin_app.repositories.notification.notification_repository import (
    AdminNotificationRepository,
)


class AdminNotificationService:

    @staticmethod
    def notify_admins(
        notification_type,
        title,
        message,
    ):
        admins = (
            AdminNotificationRepository
            .get_admin_users()
        )

        notifications = []

        for admin in admins:
            notification = (
                AdminNotificationRepository
                .create_notification(
                    user=admin,
                    notification_type=notification_type,
                    title=title,
                    message=message,
                )
            )

            notifications.append(notification)

        return notifications

    @staticmethod
    def get_user_notifications(user):
        return (
            AdminNotificationRepository
            .get_user_notifications(user)
        )

    @staticmethod
    def get_unread_count(user):
        return (
            AdminNotificationRepository
            .get_unread_count(user)
        )
        
    @staticmethod
    def get_notification_by_id(
        user,
        notification_id,
    ):
        return (
            AdminNotificationRepository
            .get_notification_by_id(
                user=user,
                notification_id=notification_id,
            )
        )

    @staticmethod
    def mark_as_read(
        user,
        notification_id,
    ):
        notification = (
            AdminNotificationRepository
            .get_notification_by_id(
                user=user,
                notification_id=notification_id,
            )
        )

        if not notification:
            return None

        return (
            AdminNotificationRepository
            .mark_as_read(notification)
        )

    @staticmethod
    def mark_all_as_read(user):
        return (
            AdminNotificationRepository
            .mark_all_as_read(user)
        )

    @staticmethod
    def delete_notification(notification):
        return (
            AdminNotificationRepository
            .delete_notification(notification)
        )

    @staticmethod
    def delete_all_notifications(user):
        return (
            AdminNotificationRepository
            .delete_all_notifications(user)
        )