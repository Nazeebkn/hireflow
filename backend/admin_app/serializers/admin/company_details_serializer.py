from rest_framework import serializers

from company_app.models import Company


class CompanyDetailsSerializer(serializers.ModelSerializer):

    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True,
    )

    class Meta:
        model = Company

        fields = [
            "id",
            "user",
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
            "created_at",
            "is_active",
        ]