from rest_framework import serializers


class UserStatusSerializer(serializers.Serializer):

    is_active = serializers.BooleanField()