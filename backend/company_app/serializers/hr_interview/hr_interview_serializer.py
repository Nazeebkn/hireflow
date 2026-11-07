
from rest_framework import serializers

from company_app.models import HRInterview


class HRInterviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = HRInterview

        fields = [
            "id",
            "application",
            "scheduled_at",
            "duration",
            "status",
            "meeting_link",
            "result",
            "feedback",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "application",
            "status",
            "meeting_link",
            "result",
            "feedback",
            "created_at",
            "updated_at",
        ]
