from rest_framework import serializers


class RejectCompanySerializer(serializers.Serializer):

    rejection_reason = serializers.CharField(
        required=True,
        allow_blank=False,
    )

    def validate_rejection_reason(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Rejection reason is required."
            )

        if len(value) < 5:
            raise serializers.ValidationError(
                "Rejection reason must be at least 5 characters."
            )

        if len(value) > 500:
            raise serializers.ValidationError(
                "Rejection reason cannot exceed 500 characters."
            )

        return value