from rest_framework import serializers
from ..models import CandidateProfile


class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        exclude = ("user", "created_at", "updated_at")
        