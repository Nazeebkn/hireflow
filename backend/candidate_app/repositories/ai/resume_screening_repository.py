from company_app.models import AIResumeScreening


class ResumeScreeningRepository:

    @staticmethod
    def create_screening(
        application,
        overall_score,
        skills_score,
        experience_score,
        education_score,
        recommendation,
        summary,
        strengths,
        gaps,
    ):
        return AIResumeScreening.objects.create(
            application=application,
            overall_score=overall_score,
            skills_score=skills_score,
            experience_score=experience_score,
            education_score=education_score,
            recommendation=recommendation,
            summary=summary,
            strengths=strengths,
            gaps=gaps,
        )

    @staticmethod
    def update_application_status(application, status):
        application.status = status
        application.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )
        return application

    @staticmethod
    def get_screening_by_application(application):
        return AIResumeScreening.objects.filter(
            application=application
        ).first()