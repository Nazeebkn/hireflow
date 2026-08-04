from rest_framework import serializers


class RejectCompanySerializer(serializers.Serializer):

    rejection_reason = serializers.CharField()