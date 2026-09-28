from candidate_app.models import Notification


class NotificationRepository:

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
    def mark_as_read(notification):
        notification.is_read = True
        notification.save(
            update_fields=["is_read"]
        )
        return notification