from rest_framework import serializers

from candidate_app.models import CandidateSkill


class CandidateSkillSerializer(serializers.ModelSerializer):

    skill_name = serializers.CharField(
        source="skill.name",
        read_only=True
    )

    class Meta:
        model = CandidateSkill
        exclude = (
            "candidate_profile",
            "created_at",
            "updated_at",
        )