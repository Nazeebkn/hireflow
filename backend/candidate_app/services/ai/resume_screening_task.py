from candidate_app.services.ai.resume_screening_service import (
    ResumeScreeningService,
)
from company_app.models import JobApplication


def _get_resume_screening_error_category(error):
    response = getattr(error, "response", None)
    status_codes = (
        getattr(error, "status_code", None),
        getattr(error, "code", None),
        getattr(response, "status_code", None),
    )

    error_text = str(error).lower()
    quota_indicators = (
        "quota",
        "too_many_requests",
        "429",
        "resource_exhausted",
        "rate limit",
        "rate_limit",
    )

    if any(str(code) == "429" for code in status_codes) or any(
        indicator in error_text
        for indicator in quota_indicators
    ):
        return "QUOTA_ERROR"

    return "OTHER_ERROR"


def run_resume_screening(application_id):

    try:
        application = JobApplication.objects.get(
            id=application_id
        )

        ResumeScreeningService.screen_resume(
            application
        )

    except Exception as exc:

        error_category = _get_resume_screening_error_category(exc)

        application = JobApplication.objects.filter(
            id=application_id
        ).first()

        if application:
            application.status = (
                JobApplication.ApplicationStatus.APPLIED
            )

            application.resume_screening_error = error_category

            application.save(
                update_fields=[
                    "status",
                    "resume_screening_error",
                    "updated_at",
                ]
            )

        print(
            f"Resume screening failed for application "
            f"{application_id} ({error_category})."
        )