from rest_framework import serializers

from company_app.models import Company


class PendingCompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company

        fields = [
            "id",
            "company_name",
            "industry",
            "contact_person",
            "approval_status",
            "created_at",
        ]