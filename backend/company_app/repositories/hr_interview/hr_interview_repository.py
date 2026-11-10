from company_app.models import HRInterview


class HRInterviewRepository:

    @staticmethod
    def get_interview_by_id(interview_id):
        return (
            HRInterview.objects
            .filter(id=interview_id)
            .select_related(
                "application",
                "application__candidate",
                "application__job",
                "application__job__company",
            )
            .first()
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
                "application__job__company",
            )
            .first()
        )

    @staticmethod
    def get_interview_for_company(interview_id, company):
        return (
            HRInterview.objects
            .filter(
                id=interview_id,
                application__job__company=company,
            )
            .select_related(
                "application",
                "application__candidate",
                "application__job",
                "application__job__company",
            )
            .first()
        )