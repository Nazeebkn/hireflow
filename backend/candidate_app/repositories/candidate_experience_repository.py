from candidate_app.models import CandidateExperience


class CandidateExperienceRepository:

    @staticmethod
    def create(candidate_profile, validated_data):

        return CandidateExperience.objects.create(
            candidate_profile=candidate_profile,
            **validated_data
        )

    @staticmethod
    def get_all_by_candidate(candidate_profile):

        return CandidateExperience.objects.filter(
            candidate_profile=candidate_profile
        )

    @staticmethod
    def get_by_id(experience_id, candidate_profile):

        return CandidateExperience.objects.filter(
            id=experience_id,
            candidate_profile=candidate_profile
        ).first()

    @staticmethod
    def update(experience, validated_data):

        for field, value in validated_data.items():
            setattr(experience, field, value)

        experience.save()

        return experience

    @staticmethod
    def delete(experience):

        experience.delete()