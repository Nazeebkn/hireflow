from rest_framework import serializers

from candidate_app.models import AIInterviewQuestion


class AIInterviewQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIInterviewQuestion

        fields = [
            "id",
            "interview",
            "question_text",
            "question_type",
            "difficulty",
            "skill",
            "question_order",
            "programming_language",
            "starter_code",
            "test_cases",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "interview",
            "question_text",
            "question_type",
            "difficulty",
            "skill",
            "question_order",
            "programming_language",
            "starter_code",
            "test_cases",
            "created_at",
            "updated_at",
        ]