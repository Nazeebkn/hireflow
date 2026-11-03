from candidate_app.models import Notification
from users.models import User


class AdminNotificationRepository:

    @staticmethod
    def get_admin_users():
        return User.objects.filter(
            role=User.UserRole.ADMIN,
            is_active=True,
        )

    @staticmethod
    def create_notification(
        user,
        notification_type,
        title,
        message,
    ):
        return Notification.objects.create(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
        )

    @staticmethod
    def get_user_notifications(user):
        return Notification.objects.filter(
            user=user
        ).order_by("-created_at")

    @staticmethod
    def get_unread_count(user):
        return Notification.objects.filter(
            user=user,
            is_read=False,
        ).count()

    @staticmethod
    def get_notification_by_id(
        user,
        notification_id,
    ):
        return Notification.objects.filter(
            user=user,
            id=notification_id,
        ).first()

    @staticmethod
    def mark_as_read(notification):
        notification.is_read = True
        notification.save(
            update_fields=["is_read"]
        )

        return notification

    @staticmethod
    def mark_all_as_read(user):
        return Notification.objects.filter(
            user=user,
            is_read=False,
        ).update(is_read=True)

    @staticmethod
    def delete_notification(notification):
        notification.delete()

    @staticmethod
    def delete_all_notifications(user):
        Notification.objects.filter(
            user=user
        ).delete()