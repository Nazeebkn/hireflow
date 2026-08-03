from rest_framework import serializers

from company_app.models import Company


class CompanySerializer(serializers.ModelSerializer):
    """
    Used for Create and Update operations.
    """

    class Meta:
        model = Company

        fields = (
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
        )


class CompanyDetailSerializer(serializers.ModelSerializer):
    """
    Used for Read operations.
    """

    class Meta:
        model = Company

        fields = (
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
            "rejection_reason",
        )