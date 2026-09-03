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

    def validate_employment_type(self, value):

        valid_types = [
            "FULL_TIME",
            "PART_TIME", 
            "CONTRACT",
            "INTERNSHIP",
        ]

        if value not in valid_types:
            raise serializers.ValidationError(
                "Please select a valid Employment Type."
            )

        return value