from rest_framework.exceptions import NotFound

from candidate_app.repositories.candidate_profile_repository import CandidateProfileRepository
from candidate_app.repositories.candidate_experience_repository import CandidateExperienceRepository


class CandidateExperienceService:

    @staticmethod
    def create_experience(user, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        return CandidateExperienceRepository.create(
            profile,
            validated_data
        )

    @staticmethod
    def get_all_experiences(user):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        return CandidateExperienceRepository.get_all_by_candidate(
            profile
        )

    @staticmethod
    def get_experience(user, experience_id):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        experience = CandidateExperienceRepository.get_by_id(
            experience_id,
            profile
        )

        if not experience:
            raise NotFound("Experience not found.")

        return experience

    @staticmethod
    def update_experience(user, experience_id, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        experience = CandidateExperienceRepository.get_by_id(
            experience_id,
            profile
        )

        if not experience:
            raise NotFound("Experience not found.")

        return CandidateExperienceRepository.update(
            experience,
            validated_data
        )

    @staticmethod
    def delete_experience(user, experience_id):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        experience = CandidateExperienceRepository.get_by_id(
            experience_id,
            profile
        )

        if not experience:
            raise NotFound("Experience not found.")

        CandidateExperienceRepository.delete(
            experience
        )