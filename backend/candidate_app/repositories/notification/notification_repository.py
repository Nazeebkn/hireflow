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

    @staticmethod
    def mark_all_as_read(user):
        Notification.objects.filter(
            user=user,
            is_read=False,
        ).update(
            is_read=True
        )

    @staticmethod
    def get_unread_count(user):
        return Notification.objects.filter(
            user=user,
            is_read=False,
        ).count()

    @staticmethod
    def delete_all_notifications(user):
        Notification.objects.filter(
            user=user
        ).delete()
        

        
    @staticmethod
    def delete_notification(notification):
        notification.delete()
        
    @staticmethod
    def get_notification_by_user(notification_id, user):
        return Notification.objects.filter(
            id=notification_id,
            user=user,
        ).first()