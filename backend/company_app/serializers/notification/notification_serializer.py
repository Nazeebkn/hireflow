from rest_framework import serializers

from candidate_app.models import Notification


class CompanyNotificationSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Notification
        fields = [
            "id",
            "notification_type",
            "title",
            "message",
            "is_read",
            "created_at",
        ]