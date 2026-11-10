
from company_app.models import HRInterview


class CandidateHRInterviewRepository:

    @staticmethod
    def get_candidate_hr_interviews(candidate):

        return (
            HRInterview.objects
            .filter(
                application__candidate=candidate
            )
            .select_related(
                "application",
                "application__job",
            )
            .order_by("-scheduled_at")
        )



    @staticmethod
    def get_interview_for_candidate(interview_id, candidate):
        return (
            HRInterview.objects
            .filter(
                id=interview_id,
                application__candidate=candidate,
            )
            .select_related(
                "application",
                "application__candidate",
                "application__job",
            )
            .first()
        )
