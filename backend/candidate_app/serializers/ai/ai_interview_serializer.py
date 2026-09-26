from rest_framework import serializers

from company_app.models import AIInterview


class AIInterviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIInterview

        fields = [
            "id",
            "application",
            "scheduled_at",
            "duration",
            "status",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
        ]