from candidate_app.models import CandidateEducation


class CandidateEducationRepository:

    @staticmethod
    def create(candidate_profile, validated_data):

        return CandidateEducation.objects.create(
            candidate_profile=candidate_profile,
            **validated_data
        )

    @staticmethod
    def get_all_by_candidate(candidate_profile):

        return CandidateEducation.objects.filter(
            candidate_profile=candidate_profile
        )

    @staticmethod
    def get_by_id(education_id, candidate_profile):

        return CandidateEducation.objects.filter(
            id=education_id,
            candidate_profile=candidate_profile
        ).first()

    @staticmethod
    def update(education, validated_data):

        for field, value in validated_data.items():
            setattr(education, field, value)

        education.save()

        return education

    @staticmethod
    def delete(education):

        education.delete()
        