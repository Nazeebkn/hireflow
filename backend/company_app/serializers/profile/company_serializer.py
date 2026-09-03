from rest_framework import serializers

from company_app.models import Company


class CompanySerializer(serializers.ModelSerializer):

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

    def validate_company_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Company Name is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Company Name must be at least 2 characters."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Company Name cannot exceed 100 characters."
            )

        if not value[0].isalpha():
            raise serializers.ValidationError(
                "Company Name must start with a letter."
            )

        if "  " in value:
            raise serializers.ValidationError(
                "Company Name cannot contain multiple consecutive spaces."
            )

        if not all(
            char.isalnum() or char in " .&'(),/-"
            for char in value
        ):
            raise serializers.ValidationError(
                "Company Name contains invalid characters."
            )

        return value

    def validate_industry(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Please select an industry."
            )

        return value

    def validate_company_size(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Please select company size."
            )

        return value

    def validate_description(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Company Description is required."
            )

        if len(value) < 20:
            raise serializers.ValidationError(
                "Company Description must be at least 20 characters."
            )

        if len(value) > 1000:
            raise serializers.ValidationError(
                "Company Description cannot exceed 1000 characters."
            )

        return value

    def validate_contact_person(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Contact Person is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Contact Person must be at least 2 characters."
            )

        if len(value) > 50:
            raise serializers.ValidationError(
                "Contact Person cannot exceed 50 characters."
            )

        if not value[0].isalpha():
            raise serializers.ValidationError(
                "Contact Person must start with a letter."
            )

        if "  " in value:
            raise serializers.ValidationError(
                "Contact Person cannot contain multiple consecutive spaces."
            )

        if not all(
            char.isalpha() or char in " .'"
            for char in value
        ):
            raise serializers.ValidationError(
                "Contact Person can contain only letters and spaces."
            )

        return value

    def validate_contact_phone(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Contact Phone is required."
            )

        if not value.isdigit():
            raise serializers.ValidationError(
                "Contact Phone must contain only digits."
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                "Contact Phone must be exactly 10 digits."
            )

        if value[0] not in "6789":
            raise serializers.ValidationError(
                "Please enter a valid Indian phone number."
            )

        return value

    def validate_country(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Country is required."
            )

        return value

    
    def validate_website(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Website is required."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Website URL cannot exceed 255 characters."
            )

        if not value.startswith(("http://", "https://")):
            raise serializers.ValidationError(
                "Website must be a valid URL starting with http:// or https://."
            )

        return value


    def validate_state(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "State is required."
            )

        return value

    def validate_city(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "City is required."
            )

        return value

    def validate_address(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Company Address is required."
            )

        return value

    def validate_company_logo(self, value):
        if not value:
            return value

        allowed_types = [
            "image/jpeg",
            "image/png",
        ]

        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only JPG, JPEG and PNG images are allowed."
            )

        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Company Logo must not exceed 5 MB."
            )

        return value

    def validate_verification_document(self, value):
        if not value:
            raise serializers.ValidationError(
                "Verification Document is required."
            )

        allowed_types = [
            "application/pdf",
            "image/jpeg",
            "image/png",
        ]

        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only PDF, JPG, JPEG and PNG files are allowed."
            )

        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Verification Document must not exceed 5 MB."
            )

        return value
    
    
    
    
    
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