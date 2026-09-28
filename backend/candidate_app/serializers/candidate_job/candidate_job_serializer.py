from rest_framework import serializers

from company_app.models import Job


class CandidateJobSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True
    )

    company_logo = serializers.SerializerMethodField()

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
            "published_at",
            "company_name",
            "company_logo",
        )

        read_only_fields = fields

    def get_company_logo(self, obj):
        if obj.company and obj.company.company_logo:
            return obj.company.company_logo.url

        return None