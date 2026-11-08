
import re

from rest_framework import serializers

from company_app.models import HRInterview


class HRInterviewSerializer(serializers.ModelSerializer):

    reschedule_reason = serializers.ChoiceField(
        choices=HRInterview.RescheduleReason.choices,
        required=False,
        allow_blank=True,
        default="",
    )

    reschedule_note = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
        trim_whitespace=True,
        max_length=1000,
        write_only=True,
    )

    class Meta:
        model = HRInterview

        fields = [
            "id",
            "application",
            "scheduled_at",
            "duration",
            "status",
            "result",
            "feedback",
            "reschedule_reason",
            "reschedule_note",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "application",
            "status",
            "result",
            "feedback",
            "created_at",
            "updated_at",
        ]

    def validate_reschedule_note(self, value):
        value = value.strip()

        if value and not re.fullmatch(r"[A-Za-z ]+", value):
            raise serializers.ValidationError(
                "Only English letters and spaces are allowed. "
                "Numbers and special characters are not allowed."
            )

        return value

    def validate(self, attrs):
        reason = attrs.get("reschedule_reason", "")
        note = attrs.get("reschedule_note", "").strip()

        if reason == HRInterview.RescheduleReason.OTHER and not note:
            raise serializers.ValidationError({
                "reschedule_note": (
                    "Please provide a reschedule explanation."
                )
            })

        return attrs
