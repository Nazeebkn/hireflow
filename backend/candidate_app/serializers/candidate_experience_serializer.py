from rest_framework import serializers
from ..models import CandidateExperience


class CandidateExperienceSerializer(serializers.ModelSerializer):

    class Meta:
        model = CandidateExperience
        exclude = (
            "candidate_profile",
            "created_at",
            "updated_at",
        )