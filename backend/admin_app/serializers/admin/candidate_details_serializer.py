from rest_framework import serializers

from candidate_app.models import CandidateProfile


class CandidateDetailsSerializer(serializers.ModelSerializer):

    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True,
    )

    class Meta:

        model = CandidateProfile

        fields = [
            "id",
            "user",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
            "gender",
            "location",
            "profile_picture",
            "headline",
            "about",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "resume",
            "created_at",
            "is_active",
        ]