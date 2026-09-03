from rest_framework import serializers

from candidate_app.models import CandidateProfile


class CandidateListSerializer(serializers.ModelSerializer):

    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True,
    )

    class Meta:

        model = CandidateProfile

        fields = [
            "id",
            "first_name",
            "last_name",
            "phone_number",
            "location",
            "created_at",
            "is_active",
        ]