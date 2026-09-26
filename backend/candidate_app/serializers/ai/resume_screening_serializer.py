from rest_framework import serializers

from company_app.models import AIResumeScreening


class ResumeScreeningSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIResumeScreening

        fields = [
            "id",
            "application",
            "overall_score",
            "skills_score",
            "experience_score",
            "education_score",
            "recommendation",
            "summary",
            "strengths",
            "gaps",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields