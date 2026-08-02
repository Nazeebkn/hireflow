from rest_framework.exceptions import NotFound

from candidate_app.repositories.candidate_profile_repository import (
    CandidateProfileRepository,
)
from candidate_app.repositories.candidate_skill_repository import (
    CandidateSkillRepository,
)
from candidate_app.repositories.skill_repository import (
    SkillRepository,
)


class CandidateSkillService:

    @staticmethod
    def create_skill(user, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        if "skill_name" in validated_data:

            skill = SkillRepository.get_or_create(
                validated_data.pop("skill_name")
            )

            validated_data["skill"] = skill

        return CandidateSkillRepository.create(
            profile,
            validated_data
        )
        
    @staticmethod
    def get_all_skills(user):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        return CandidateSkillRepository.get_all_by_candidate(
            profile
        )

    @staticmethod
    def get_skill(user, skill_id):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        candidate_skill = CandidateSkillRepository.get_by_id(
            skill_id,
            profile
        )

        if not candidate_skill:
            raise NotFound("Skill not found.")

        return candidate_skill

    @staticmethod
    def update_skill(user, skill_id, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        candidate_skill = CandidateSkillRepository.get_by_id(
            skill_id,
            profile
        )

        if not candidate_skill:
            raise NotFound("Skill not found.")

        return CandidateSkillRepository.update(
            candidate_skill,
            validated_data
        )

    @staticmethod
    def delete_skill(user, skill_id):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        candidate_skill = CandidateSkillRepository.get_by_id(
            skill_id,
            profile
        )

        if not candidate_skill:
            raise NotFound("Skill not found.")

        CandidateSkillRepository.delete(
            candidate_skill
        )