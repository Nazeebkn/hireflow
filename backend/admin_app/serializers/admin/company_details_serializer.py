from rest_framework import serializers

from company_app.models import Company


class CompanyDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company

        fields = [
            "id",
            "company_name",
            "industry",
            "company_size",
            "website",
            "description",
            "contact_person",
            "contact_phone",
            "country",
            "state",
            "city",
            "address",
            "company_logo",
            "verification_document",
            "approval_status",
            "created_at",
        ]