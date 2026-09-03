from rest_framework import serializers


class CareerProfileCompletionSerializer(serializers.Serializer):

    education = serializers.CharField()
    institution_name = serializers.CharField()
    qualification = serializers.CharField()
    graduation_year = serializers.IntegerField()

    experience_level = serializers.CharField()

    current_job_title = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    current_company = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    primary_skill = serializers.CharField()

    expected_salary = serializers.IntegerField(
        required=False,
        allow_null=True,
    )

    def validate_education(self, value):
        valid_levels = [
            "HIGH_SCHOOL",
            "HIGHER_SECONDARY",
            "DIPLOMA",
            "BACHELORS",
            "MASTERS",
            "PHD",
        ]

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Please select your highest education qualification."
            )

        if value not in valid_levels:
            raise serializers.ValidationError(
                "Please select a valid education qualification."
            )

        return value

    def validate_institution_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Institution Name is required."
            )

        if len(value) < 3:
            raise serializers.ValidationError(
                "Institution Name must be at least 3 characters."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Institution Name cannot exceed 100 characters."
            )

        if not value[0].isalpha():
            raise serializers.ValidationError(
                "Institution Name must start with a letter."
            )

        return value

    def validate_qualification(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Qualification is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Qualification must be at least 2 characters."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Qualification cannot exceed 100 characters."
            )

        if not value[0].isalpha():
            raise serializers.ValidationError(
                "Qualification must start with a letter."
            )

        return value

    def validate_graduation_year(self, value):
        current_year = 2026

        if value < 1950:
            raise serializers.ValidationError(
                "Please enter a valid year."
            )

        if value > current_year:
            raise serializers.ValidationError(
                "Year cannot be in the future."
            )

        return value

    def validate_experience_level(self, value):
        valid_levels = [
            "FRESHER",
            "0-1",
            "1-3",
            "3-5",
            "5+",
        ]

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Please select your experience level."
            )

        if value not in valid_levels:
            raise serializers.ValidationError(
                "Please select a valid experience level."
            )

        return value

    def validate_current_job_title(self, value):
        value = value.strip()

        if len(value) > 100:
            raise serializers.ValidationError(
                "Job Title cannot exceed 100 characters."
            )

        if value and len(value) < 2:
            raise serializers.ValidationError(
                "Job Title must be at least 2 characters."
            )

        if value and not value[0].isalpha():
            raise serializers.ValidationError(
                "Job Title must start with a letter."
            )

        return value

    def validate_current_company(self, value):
        value = value.strip()

        if len(value) > 100:
            raise serializers.ValidationError(
                "Current Company cannot exceed 100 characters."
            )

        if value and len(value) < 2:
            raise serializers.ValidationError(
                "Current Company must be at least 2 characters."
            )

        if value and not value[0].isalpha():
            raise serializers.ValidationError(
                "Current Company must start with a letter."
            )

        return value

    def validate_primary_skill(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Primary Skill is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Primary Skill is too short."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Primary Skill cannot exceed 100 characters."
            )

        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError(
                "Primary Skill must contain letters."
            )

        return value

    def validate_expected_salary(self, value):
        if value is None:
            return value

        if value < 10000:
            raise serializers.ValidationError(
                "Expected Annual CTC must be at least ₹10,000."
            )

        if value > 100000000:
            raise serializers.ValidationError(
                "Expected Annual CTC cannot exceed ₹10,00,00,000."
            )

        return value

    def validate(self, attrs):

        experience_level = attrs.get("experience_level")

        current_job_title = attrs.get(
            "current_job_title",
            ""
        ).strip()

        current_company = attrs.get(
            "current_company",
            ""
        ).strip()

        if experience_level != "FRESHER":

            if not current_job_title:
                raise serializers.ValidationError({
                    "current_job_title":
                        "Job Title is required for experienced candidates."
                })

            if not current_company:
                raise serializers.ValidationError({
                    "current_company":
                        "Current Company is required for experienced candidates."
                })

        attrs["current_job_title"] = current_job_title
        attrs["current_company"] = current_company

        return attrs