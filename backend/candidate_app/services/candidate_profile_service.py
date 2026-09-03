import time
from candidate_app.repositories.candidate_profile_repository import CandidateProfileRepository

from rest_framework.exceptions import ValidationError, NotFound

from cloudinary import uploader

class CandidateProfileService:

    @staticmethod
    def create_profile(user, validated_data):

        if CandidateProfileRepository.exists(user):
            raise ValidationError("Profile already exists.")

        profile_picture = validated_data.pop("profile_picture", None)

        if profile_picture:
            result = uploader.upload(
            profile_picture,
            folder="candidate/profile_pictures",
            resource_type="image"
        )
            

        validated_data["profile_picture"] = result["secure_url"]

        profile = CandidateProfileRepository.create(
            user,
            validated_data
        )


        return profile


    @staticmethod
    def get_profile(user):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        return profile
    
    
    

    @staticmethod
    def update_profile(user, validated_data):

        start = time.perf_counter()

        profile = CandidateProfileRepository.get_by_user(user)

        print(
            "GET PROFILE TIME:",
            time.perf_counter() - start
        )

        if not profile:
            raise NotFound("Candidate profile not found.")

        start = time.perf_counter()

        profile = CandidateProfileRepository.update(
            profile,
            validated_data
        )

        print(
            "PROFILE UPDATE TIME:",
            time.perf_counter() - start
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
