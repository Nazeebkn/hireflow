from company_app.models import JobApplication

from candidate_app.services.ai.resume_screening_service import (
    ResumeScreeningService,
)


def run_resume_screening(application_id):

    try:
        application = JobApplication.objects.get(
            id=application_id
        )

        ResumeScreeningService.screen_resume(
            application
        )

    except Exception as exc:

        application = JobApplication.objects.filter(
            id=application_id
        ).first()

        if application:
            application.status = (
                JobApplication.ApplicationStatus.APPLIED
            )

            application.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

        print(
            f"Resume screening failed for application "
            f"{application_id}: {exc}"
        )