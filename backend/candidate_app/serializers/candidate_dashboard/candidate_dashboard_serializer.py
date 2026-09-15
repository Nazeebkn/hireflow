from rest_framework import serializers

from candidate_app.serializers.candidate_profile_serializer import (
    CandidateProfileSerializer,
)

from candidate_app.serializers.candidate_job_preference_serializer import (
    CandidateJobPreferenceSerializer,
)


class CandidateDashboardSerializer(serializers.Serializer):

    profile = CandidateProfileSerializer()

    education_count = serializers.IntegerField()

    experience_count = serializers.IntegerField()

    skill_count = serializers.IntegerField()

    job_preference = CandidateJobPreferenceSerializer(
        allow_null=True
    )

    application_count = serializers.IntegerField()

    active_process_count = serializers.IntegerField()

    interview_count = serializers.IntegerField()

    offer_count = serializers.IntegerField()