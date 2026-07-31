from rest_framework import serializers

from candidate_app.models import CandidateJobPreference


class CandidateJobPreferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = CandidateJobPreference
        exclude = (
            "candidate_profile",
            "created_at",
            "updated_at",
        )