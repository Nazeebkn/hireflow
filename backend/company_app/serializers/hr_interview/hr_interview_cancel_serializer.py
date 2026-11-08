
import re

from rest_framework import serializers

from company_app.models import HRInterview


class HRInterviewCancelSerializer(serializers.Serializer):

    cancellation_reason = serializers.ChoiceField(
        choices=HRInterview.CancellationReason.choices
    )

    cancellation_note = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
        trim_whitespace=True,
        max_length=1000,
    )

    def validate_cancellation_note(self, value):
        value = value.strip()

        if value and not re.fullmatch(r"[A-Za-z ]+", value):
            raise serializers.ValidationError(
                "Only text and spaces are allowed. "
                "Numbers and special characters are not allowed."
            )

        return value

    def validate(self, attrs):
        reason = attrs["cancellation_reason"]
        note = attrs.get("cancellation_note", "").strip()

        if reason == HRInterview.CancellationReason.OTHER and not note:
            raise serializers.ValidationError({
                "cancellation_note": (
                    "Please provide a cancellation explanation."
                )
            })

        return attrs
