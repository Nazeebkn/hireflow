from ..models import CandidateProfile


class CandidateProfileRepository:

    @staticmethod
    def exists(user):
        return CandidateProfile.objects.filter(user=user).exists()

    @staticmethod
    def create(user, validated_data):
        return CandidateProfile.objects.create(
            user=user,
            **validated_data
        )

    @staticmethod
    def get_by_user(user):
        return CandidateProfile.objects.filter(user=user).first()
    
    
    @staticmethod
    def update(profile, validated_data):

        for field, value in validated_data.items():
            setattr(profile, field, value)

        profile.save()

        return profile
    
    
    @staticmethod
    def update_resume(profile, resume):

        profile.resume = resume

        profile.save(
            update_fields=["resume"]
        )

        return profile
        
