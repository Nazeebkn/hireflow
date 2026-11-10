
import re

from rest_framework import serializers

from company_app.models import HRInterview


class HRInterviewReportSerializer(serializers.ModelSerializer):

    result = serializers.ChoiceField(
        choices=HRInterview.InterviewResult.choices,
        required=True,
    )

    technical_skills_rating = serializers.IntegerField(
        min_value=1,
        max_value=10,
        required=True,
    )

    communication_rating = serializers.IntegerField(
        min_value=1,
        max_value=10,
        required=True,
    )

    problem_solving_rating = serializers.IntegerField(
        min_value=1,
        max_value=10,
        required=True,
    )

    feedback = serializers.CharField(
        required=True,
        allow_blank=False,
        allow_null=False,
        trim_whitespace=True,
        min_length=10,
        max_length=3000,
    )

    additional_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=False,
        trim_whitespace=True,
        max_length=2000,
        default="",
    )

    class Meta:
        model = HRInterview

        fields = [
            "result",
            "technical_skills_rating",
            "communication_rating",
            "problem_solving_rating",
            "feedback",
            "additional_notes",
        ]

    def validate_feedback(self, value):
        value = value.strip()

        if not re.fullmatch(
            r"[A-Za-z0-9 .,!?'\u0022():;/\-]+",
            value,
        ):
            raise serializers.ValidationError(
                "Only English letters, numbers, spaces, "
                "and standard punctuation are allowed."
            )

        if not re.search(r"[A-Za-z]", value):
            raise serializers.ValidationError(
                "Feedback must contain meaningful text."
            )

        return value

    def validate_additional_notes(self, value):
        value = value.strip()

        if not value:
            return ""

        if not re.fullmatch(
            r"[A-Za-z0-9 .,!?'\u0022():;/\-]+",
            value,
        ):
            raise serializers.ValidationError(
                "Only English letters, numbers, spaces, "
                "and standard punctuation are allowed."
            )

        if not re.search(r"[A-Za-z]", value):
            raise serializers.ValidationError(
                "Additional notes must contain meaningful text."
            )

        return value
