from users.models import User


class CandidateProfileCompletionRepository:

    @staticmethod
    def complete_profile(user):

        user.profile_completed = True

        user.save(
            update_fields=["profile_completed"]
        )

        return user