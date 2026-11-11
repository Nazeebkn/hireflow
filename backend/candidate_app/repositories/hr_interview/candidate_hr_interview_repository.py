
from company_app.models import HRInterview
from django.utils import timezone

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
                "application__job__company",
                "application__job__company__user",
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


    @staticmethod
    def get_interview_for_contact(interview_id, candidate):
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
                "application__job__company__user",
            )
            .first()
        )

    @staticmethod
    def claim_contact_company_email(interview_id):
        claimed_at = timezone.now()

        updated = HRInterview.objects.filter(
            id=interview_id,
            contact_company_email_sent_at__isnull=True,
        ).update(
            contact_company_email_sent_at=claimed_at
        )

        return updated == 1


    @staticmethod
    def release_contact_company_email_claim(interview_id):
        HRInterview.objects.filter(
            id=interview_id,
        ).update(
            contact_company_email_sent_at=None
        )