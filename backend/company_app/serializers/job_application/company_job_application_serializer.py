from rest_framework import serializers

from company_app.models import JobApplication


class CompanyJobApplicationSerializer(
    serializers.ModelSerializer
):

    candidate_name = serializers.SerializerMethodField()

    candidate_initials = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication

        fields = [
            "id",
            "candidate_name",
            "candidate_initials",
            "status",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = fields

    def get_candidate_name(self, obj):

        if not obj.candidate:
            return "Candidate"

        name = (
            f"{obj.candidate.first_name} "
            f"{obj.candidate.last_name}"
        ).strip()

        return name or "Candidate"

    def get_candidate_initials(self, obj):

        if not obj.candidate:
            return "C"

        first_name = (
            obj.candidate.first_name or ""
        ).strip()

        last_name = (
            obj.candidate.last_name or ""
        ).strip()

        initials = ""

        if first_name:
            initials += first_name[0].upper()

        if last_name:
            initials += last_name[0].upper()

        return initials or "C"