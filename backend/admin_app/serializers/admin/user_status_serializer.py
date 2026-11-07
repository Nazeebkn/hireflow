from rest_framework import serializers


class UserStatusSerializer(serializers.Serializer):

    is_active = serializers.BooleanField()

    reason = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    def validate(self, attrs):
        is_active = attrs.get("is_active")
        reason = (attrs.get("reason") or "").strip()

        if not is_active and not reason:
            raise serializers.ValidationError({
                "reason": "Suspension reason is required."
            })

        attrs["reason"] = reason or None

        return attrs