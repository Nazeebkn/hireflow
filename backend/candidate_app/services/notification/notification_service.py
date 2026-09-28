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
        
        
    @staticmethod
    def mark_all_as_read(user):
        NotificationRepository.mark_all_as_read(
            user=user
        )
        
        
    @staticmethod
    def get_unread_count(user):
        return NotificationRepository.get_unread_count(
            user=user
        )
        
    @staticmethod
    def delete_all_notifications(user):
        NotificationRepository.delete_all_notifications(user=user)
        
        
    @staticmethod
    def delete_notification(notification):
        return NotificationRepository.delete_notification(
            notification=notification
        )
        
    @staticmethod
    def get_notification_by_user(notification_id, user):
        return NotificationRepository.get_notification_by_user(
            notification_id=notification_id,
            user=user,
        )