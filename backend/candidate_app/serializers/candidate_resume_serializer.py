from rest_framework import serializers

from candidate_app.models import CandidateProfile


class CandidateResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CandidateProfile
        fields = (
            "resume",
        )

    def validate_resume(self, value):

        if not value:
            raise serializers.ValidationError(
                "Resume is required."
            )

        allowed_extensions = [
            ".pdf",
            ".doc",
            ".docx",
        ]

        file_name = value.name.lower()

        if not any(
            file_name.endswith(extension)
            for extension in allowed_extensions
        ):
            raise serializers.ValidationError(
                "Only PDF, DOC, and DOCX resume files are allowed."
            )

        max_size = 5 * 1024 * 1024  # 5 MB

        if value.size > max_size:
            raise serializers.ValidationError(
                "Resume file size cannot exceed 5 MB."
            )

        return value