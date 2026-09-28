from rest_framework import serializers

from candidate_app.models import CandidateSkill


class CandidateSkillSerializer(serializers.ModelSerializer):

    skill_name = serializers.CharField(
        write_only=True,
        required=False
    )

    skill = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:
        model = CandidateSkill
        fields = (
            "id",
            "skill",
            "skill_name",
            "proficiency",
            "years_of_experience",
        )

    def validate_skill_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Skill name is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Skill name must be at least 2 characters."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Skill name cannot exceed 100 characters."
            )

        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["skill_name"] = (
            instance.skill.name
            if instance.skill
            else ""
        )

        return data