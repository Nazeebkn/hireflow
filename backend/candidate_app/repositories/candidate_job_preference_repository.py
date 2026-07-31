from candidate_app.models import CandidateJobPreference


class CandidateJobPreferenceRepository:

    @staticmethod
    def create(candidate_profile, validated_data):

        return CandidateJobPreference.objects.create(
            candidate_profile=candidate_profile,
            **validated_data
        )

    @staticmethod
    def get_by_candidate(candidate_profile):

        return CandidateJobPreference.objects.filter(
            candidate_profile=candidate_profile
        ).first()

    @staticmethod
    def update(job_preference, validated_data):

        for field, value in validated_data.items():
            setattr(job_preference, field, value)

        job_preference.save()

        return job_preference