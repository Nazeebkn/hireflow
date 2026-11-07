from rest_framework import serializers

from company_app.models import Job

from company_app.models import Job, JobQuestion



class JobQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobQuestion
        fields = (
            "id",
            "question_text",
            "question_type",
            "options",
            "display_order",
        )
        read_only_fields = ("id",)

    def validate_question_text(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Question text cannot be empty."
            )

        return value

    def validate(self, attrs):
        question_type = attrs.get(
            "question_type",
            getattr(self.instance, "question_type", None)
        )

        options = attrs.get("options", [])

        if question_type == JobQuestion.QuestionType.MULTIPLE_CHOICE:
            if not isinstance(options, list) or len(options) < 2:
                raise serializers.ValidationError({
                    "options": "Multiple Choice requires at least 2 options."
                })

            cleaned_options = [
                option.strip()
                for option in options
                if isinstance(option, str) and option.strip()
            ]

            if len(cleaned_options) != len(options):
                raise serializers.ValidationError({
                    "options": "Options cannot be empty."
                })

            if len(set(option.lower() for option in cleaned_options)) != len(cleaned_options):
                raise serializers.ValidationError({
                    "options": "Duplicate options are not allowed."
                })

            attrs["options"] = cleaned_options

        else:
            attrs["options"] = []

        return attrs
    
    
    
    


class JobSerializer(serializers.ModelSerializer):

    application_count = serializers.IntegerField(
        read_only=True
    )
    
    questions = JobQuestionSerializer(many=True, required=False)


    class Meta:
        model = Job
        fields = (
            "id",
            "title",
            "description",
            "location",
            "work_mode",
            "employment_type",
            "skills",
            "experience_required",
            "education",
            "position",
            "minimum_salary",
            "maximum_salary",
            "application_deadline",
            "status",
            "published_at",
            "closed_at",
            "created_at",
            "updated_at",
            "application_count",
            "questions",
        )

        read_only_fields = (
            "id",
            "status",
            "published_at",
            "closed_at",
            "created_at",
            "updated_at",
        )

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Job title is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Job title must be at least 2 characters."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Job title cannot exceed 255 characters."
            )

        return value

    def validate_description(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Job description is required."
            )

        if len(value) < 20:
            raise serializers.ValidationError(
                "Job description must be at least 20 characters."
            )

        return value

    def validate_location(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Job location is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Job location must be at least 2 characters."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Job location cannot exceed 255 characters."
            )

        return value

    def validate_work_mode(self, value):
        if not value:
            raise serializers.ValidationError(
                "Work mode is required."
            )

        return value

    def validate_employment_type(self, value):
        if not value:
            raise serializers.ValidationError(
                "Employment type is required."
            )

        return value

    def validate_skills(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Skills are required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Skills must contain at least 2 characters."
            )

        if len(value) > 1000:
            raise serializers.ValidationError(
                "Skills cannot exceed 1000 characters."
            )

        return value

    def validate_experience_required(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Experience requirement is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Experience requirement must be at least 2 characters."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Experience requirement cannot exceed 100 characters."
            )

        return value

    def validate_education(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Education is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Education must be at least 2 characters."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Education cannot exceed 255 characters."
            )

        return value

    def validate_position(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Position is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Position must be at least 2 characters."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Position cannot exceed 255 characters."
            )

        return value

    def validate(self, attrs):

        minimum_salary = attrs.get("minimum_salary")
        maximum_salary = attrs.get("maximum_salary")

        if (
            minimum_salary is not None
            and maximum_salary is not None
            and minimum_salary > maximum_salary
        ):
            raise serializers.ValidationError({
                "maximum_salary":
                "Maximum salary must be greater than or equal to minimum salary."
            })
            
        questions = attrs.get("questions")

        if questions is not None:
            question_count = len(questions)

            if question_count != 0 and not 3 <= question_count <= 8:
                raise serializers.ValidationError({
                    "questions": "Add either 0 questions or between 3 and 8 questions."
                })

        return attrs
    
    