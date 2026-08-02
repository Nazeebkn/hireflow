from candidate_app.models import CandidateSkill


class CandidateSkillRepository:

    @staticmethod
    def create(candidate_profile, validated_data):

       return CandidateSkill.objects.get_or_create(
        candidate_profile=candidate_profile,
        skill=validated_data["skill"],
        defaults={
            "proficiency": validated_data.get(
                "proficiency",
                "BEGINNER",
            ),
            "years_of_experience": validated_data.get(
                "years_of_experience",
                0,
            ),
        },
    )[0]

    @staticmethod
    def get_all_by_candidate(candidate_profile):

        return CandidateSkill.objects.filter(
            candidate_profile=candidate_profile
        )

    @staticmethod
    def get_by_id(skill_id, candidate_profile):

        return CandidateSkill.objects.filter(
            id=skill_id,
            candidate_profile=candidate_profile
        ).first()

    @staticmethod
    def update(candidate_skill, validated_data):

        for field, value in validated_data.items():
            setattr(candidate_skill, field, value)

        candidate_skill.save()

        return candidate_skill

    @staticmethod
    def delete(candidate_skill):

        candidate_skill.delete()