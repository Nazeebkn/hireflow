from rest_framework import serializers

from candidate_app.models import AIInterviewReport


class AIInterviewReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIInterviewReport

        fields = [
            "id",
            "interview",
            "overall_score",
            "total_questions",
            "answered_questions",
            "strengths",
            "areas_to_improve",
            "skill_analysis",
            "recommendation",
            "summary",
            "generated_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "interview",
            "overall_score",
            "total_questions",
            "answered_questions",
            "strengths",
            "areas_to_improve",
            "skill_analysis",
            "recommendation",
            "summary",
            "generated_at",
            "updated_at",
        ]