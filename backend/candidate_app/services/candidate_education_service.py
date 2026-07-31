from candidate_app.repositories.candidate_profile_repository import CandidateProfileRepository
from candidate_app.repositories.candidate_education_repository import CandidateEducationRepository

from rest_framework.exceptions import  NotFound


class CandidateEducationService:

    @staticmethod
    def create_education(user, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        return CandidateEducationRepository.create(
            profile,
            validated_data
        )

    @staticmethod
    def get_all_educations(user):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        return CandidateEducationRepository.get_all_by_candidate(
            profile
        )

    @staticmethod
    def get_education(user, education_id):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        education = CandidateEducationRepository.get_by_id(
            education_id,
            profile
        )

        if not education:
            raise NotFound("Education not found.")

        return education

    @staticmethod
    def update_education(user, education_id, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        education = CandidateEducationRepository.get_by_id(
            education_id,
            profile
        )

        if not education:
            raise NotFound("Education not found.")

        return CandidateEducationRepository.update(
            education,
            validated_data
        )

    @staticmethod
    def delete_education(user, education_id):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        education = CandidateEducationRepository.get_by_id(
            education_id,
            profile
        )

        if not education:
            raise NotFound("Education not found.")

        CandidateEducationRepository.delete(
            education
        ) 