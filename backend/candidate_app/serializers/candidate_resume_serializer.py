from rest_framework import serializers

from candidate_app.models import CandidateProfile


class CandidateResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CandidateProfile
        fields = (
            "resume",
        )