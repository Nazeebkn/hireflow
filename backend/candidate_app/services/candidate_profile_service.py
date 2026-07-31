from candidate_app.repositories.candidate_profile_repository import CandidateProfileRepository

from rest_framework.exceptions import ValidationError, NotFound



class CandidateProfileService:

    @staticmethod
    def create_profile(user, validated_data):

        if CandidateProfileRepository.exists(user):
            raise ValidationError("Profile already exists.")

        profile = CandidateProfileRepository.create(
            user,
            validated_data
        )

        user.profile_completed = True
        user.save(update_fields=["profile_completed"])

        return profile


    @staticmethod
    def get_profile(user):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        return profile
    
    
    
    @staticmethod
    def update_profile(user, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        profile = CandidateProfileRepository.update(
            profile,
            validated_data
        )

        return profile
    

    @staticmethod
    def update_resume(user, resume):

        profile = CandidateProfileRepository.get_by_user(
            user
        )

        if not profile:
            raise NotFound(
                "Candidate profile not found."
            )

        return CandidateProfileRepository.update_resume(
            profile,
            resume
        )
