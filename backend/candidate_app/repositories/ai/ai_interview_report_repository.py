from candidate_app.models import AIInterviewReport


class AIInterviewReportRepository:

    @staticmethod
    def get_by_interview(interview):
        return (
            AIInterviewReport.objects
            .filter(interview=interview)
            .first()
        )

    @staticmethod
    def create_report(
        interview,
        overall_score,
        total_questions,
        answered_questions,
        strengths,
        areas_to_improve,
        skill_analysis,
        recommendation,
        summary,
    ):
        return AIInterviewReport.objects.create(
            interview=interview,
            overall_score=overall_score,
            total_questions=total_questions,
            answered_questions=answered_questions,
            strengths=strengths,
            areas_to_improve=areas_to_improve,
            skill_analysis=skill_analysis,
            recommendation=recommendation,
            summary=summary,
        )

    @staticmethod
    def update_report(
        report,
        overall_score,
        total_questions,
        answered_questions,
        strengths,
        areas_to_improve,
        skill_analysis,
        recommendation,
        summary,
    ):
        report.overall_score = overall_score
        report.total_questions = total_questions
        report.answered_questions = answered_questions
        report.strengths = strengths
        report.areas_to_improve = areas_to_improve
        report.skill_analysis = skill_analysis
        report.recommendation = recommendation
        report.summary = summary

        report.save()

        return report