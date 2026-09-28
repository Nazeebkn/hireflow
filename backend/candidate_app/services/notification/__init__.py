from candidate_app.repositories.notification.notification_repository import (
    NotificationRepository,
)
from candidate_app.models import Notification


class NotificationService:

    @staticmethod
    def create_notification(
        user,
        notification_type,
        title,
        message,
    ):
        return NotificationRepository.create_notification(
            user=user,
            notification_type=notification_type,
            title=title,
            message=message,
        )

    @staticmethod
    def get_user_notifications(user):
        return NotificationRepository.get_user_notifications(
            user=user
        )

    @staticmethod
    def mark_as_read(user, notification_id):
        notification = Notification.objects.filter(
            id=notification_id,
            user=user,
        ).first()

        if not notification:
            return None

        return NotificationRepository.mark_as_read(
            notification
        )