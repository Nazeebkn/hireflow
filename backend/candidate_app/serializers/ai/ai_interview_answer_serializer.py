from django.utils import timezone
from rest_framework import serializers

from candidate_app.models import AIInterviewAnswer


class AIInterviewAnswerSerializer(serializers.ModelSerializer):

    MAX_AUDIO_SIZE = 10 * 1024 * 1024  # 10 MB

    ALLOWED_AUDIO_TYPES = {
        "audio/webm",
        "audio/wav",
        "audio/mpeg",
        "audio/mp4",
        "audio/ogg",
    }

    class Meta:
        model = AIInterviewAnswer

        fields = [
            "id",
            "question",
            "answer_text",
            "audio_recording",
            "submitted_code",
            "test_results",
            "score",
            "ai_feedback",
            "submitted_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "question",
            "test_results",
            "score",
            "ai_feedback",
            "submitted_at",
            "created_at",
            "updated_at",
        ]

    # ============================================================
    # AUDIO VALIDATION
    # ============================================================

    def validate_audio_recording(self, audio_recording):

        if audio_recording is None:
            raise serializers.ValidationError(
                "Audio recording is required."
            )

        if audio_recording.size == 0:
            raise serializers.ValidationError(
                "Audio recording cannot be empty."
            )

        if audio_recording.size > self.MAX_AUDIO_SIZE:
            raise serializers.ValidationError(
                "Audio recording must not exceed 10 MB."
            )

        content_type = getattr(
            audio_recording,
            "content_type",
            None,
        )

        if content_type not in self.ALLOWED_AUDIO_TYPES:
            raise serializers.ValidationError(
                "Unsupported audio format."
            )

        return audio_recording

    # ============================================================
    # SUBMITTED CODE VALIDATION
    # ============================================================

    def validate_submitted_code(self, submitted_code):

        if submitted_code is None:
            return submitted_code

        submitted_code = submitted_code.strip()

        if not submitted_code:
            raise serializers.ValidationError(
                "Submitted code cannot be empty."
            )

        if len(submitted_code) > 50000:
            raise serializers.ValidationError(
                "Submitted code is too long."
            )

        return submitted_code

    # ============================================================
    # ANSWER TEXT VALIDATION
    # ============================================================

    def validate_answer_text(self, answer_text):

        if answer_text is None:
            return answer_text

        answer_text = answer_text.strip()

        if not answer_text:
            raise serializers.ValidationError(
                "Answer text cannot be empty."
            )

        if len(answer_text) > 10000:
            raise serializers.ValidationError(
                "Answer text is too long."
            )

        return answer_text

    # ============================================================
    # TEST RESULTS VALIDATION
    # ============================================================

    def validate_test_results(self, test_results):

        if test_results is None:
            return test_results

        if not isinstance(test_results, list):
            raise serializers.ValidationError(
                "Test results must be a list."
            )

        if len(test_results) > 100:
            raise serializers.ValidationError(
                "Too many test results."
            )

        return test_results

    # ============================================================
    # SCORE VALIDATION
    # ============================================================

    def validate_score(self, score):

        if score is None:
            return score

        if not 0 <= score <= 100:
            raise serializers.ValidationError(
                "Score must be between 0 and 100."
            )

        return score

    # ============================================================
    # AI FEEDBACK VALIDATION
    # ============================================================

    def validate_ai_feedback(self, ai_feedback):

        if ai_feedback is None:
            return ai_feedback

        ai_feedback = ai_feedback.strip()

        if not ai_feedback:
            raise serializers.ValidationError(
                "AI feedback cannot be empty."
            )

        if len(ai_feedback) > 10000:
            raise serializers.ValidationError(
                "AI feedback is too long."
            )

        return ai_feedback

    # ============================================================
    # SUBMITTED TIME VALIDATION
    # ============================================================

    def validate_submitted_at(self, submitted_at):

        if submitted_at is None:
            return submitted_at

        if submitted_at > timezone.now():
            raise serializers.ValidationError(
                "Submitted time cannot be in the future."
            )

        return submitted_at