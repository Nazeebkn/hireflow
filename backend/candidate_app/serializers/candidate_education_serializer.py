from rest_framework import serializers
from ..models import CandidateEducation



class CandidateEducationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CandidateEducation
        exclude = (
            "candidate_profile",
            "created_at",
            "updated_at",
        )
        