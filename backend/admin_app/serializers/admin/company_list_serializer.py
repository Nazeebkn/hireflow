from rest_framework import serializers

from company_app.models import Company


class CompanyListSerializer(serializers.ModelSerializer):

    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True,
    )

    class Meta:

        model = Company

        fields = [
            "id",
            "company_name",
            "industry",
            "contact_person",
            "approval_status",
            "is_active",
            "created_at",
        ]