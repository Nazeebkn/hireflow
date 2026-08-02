from rest_framework import serializers


class CareerProfileCompletionSerializer(
    serializers.Serializer
):

    # Education
    education = serializers.CharField()

    institution_name = serializers.CharField()

    qualification = serializers.CharField()

    graduation_year = serializers.IntegerField()

    # Experience
    experience_level = serializers.CharField()

    current_job_title = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    current_company = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    # Skill
    primary_skill = serializers.CharField()

    # Job Preference
    preferred_job_role = serializers.CharField()

    preferred_location = serializers.CharField()

    expected_salary = serializers.IntegerField()

    employment_type = serializers.CharField()