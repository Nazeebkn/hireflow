from rest_framework import serializers

from company_app.models import Job, JobQuestion




class CandidateJobQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobQuestion
        fields = (
            "id",
            "question_text",
            "question_type",
            "options",
            "display_order",
        )
        read_only_fields = fields
        
        
        
        



class CandidateJobSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True
    )

    company_logo = serializers.SerializerMethodField()
    
    questions = CandidateJobQuestionSerializer(
        many=True,
        read_only=True
    )

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
            "questions",
        )

        read_only_fields = fields

    def get_company_logo(self, obj):
        if obj.company and obj.company.company_logo:
            return obj.company.company_logo.url

        return None