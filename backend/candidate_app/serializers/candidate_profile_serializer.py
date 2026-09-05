from datetime import date

from rest_framework import serializers
from PIL import Image

from candidate_app.models import CandidateProfile

import re

class CandidateProfileSerializer(serializers.ModelSerializer):

    profile_picture = serializers.ImageField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = CandidateProfile
        exclude = (
            "user",
            "created_at",
            "updated_at",
        )

    def validate_first_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "First name is required."
            )

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise serializers.ValidationError(
                "First name must contain only letters."
            )

        return value

    def validate_last_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Last name is required."
            )

        if not value.replace(" ", "").isalpha():
            raise serializers.ValidationError(
                "Last name must contain only letters."
            )

        return value

    def validate_phone_number(self, value):

        value = value.strip()

        if not re.fullmatch(r"\d+", value):
            raise serializers.ValidationError(
                "Phone number must contain only digits."
            )

        if len(value) < 10 or len(value) > 15:
            raise serializers.ValidationError(
                "Phone number must contain between 10 and 15 digits."
            )

        return value


    def validate_date_of_birth(self, value):

        if value > date.today():
            raise serializers.ValidationError(
                "Date of birth cannot be in the future."
            )

        return value


    def validate_location(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Location is required."
            )

        return value



    def validate_profile_picture(self, value):

        if value is None:
            return value

        # File size validation
        max_size = 5 * 1024 * 1024  # 5 MB

        if value.size > max_size:
            raise serializers.ValidationError(
                "Profile picture must be less than 5 MB."
            )

        # Actual image validation
        try:
            image = Image.open(value)
            image.verify()

        except Exception:
            raise serializers.ValidationError(
                "Invalid profile picture. Please upload a valid image."
            )

        finally:
            value.seek(0)

        # Allowed image formats
        allowed_formats = [
            "JPEG",
            "PNG",
            "WEBP",
        ]

        if image.format not in allowed_formats:
            raise serializers.ValidationError(
                "Profile picture must be JPG, JPEG, PNG, or WEBP."
            )

        return value
    
    
    def validate_headline(self, value):

        value = value.strip()

        if len(value) < 5:
            raise serializers.ValidationError(
                "Professional headline must be at least 5 characters long."
            )

        if not re.search(r"[A-Za-z]", value):
            raise serializers.ValidationError(
                "Professional headline must contain at least one letter."
            )

        return value
    
    
    def validate_about(self, value):

        value = value.strip()

        if len(value) < 15:
            raise serializers.ValidationError(
                "About me must be at least 15 characters long."
            )

        if not re.search(r"[A-Za-z]", value):
            raise serializers.ValidationError(
                "About me must contain at least one letter."
            )

        return value
    
    
        
    def validate_profile_picture(self, value):

        if value is None:
            return value

        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Profile picture must be less than 5 MB."
            )

        allowed_formats = ["JPEG", "PNG", "WEBP"]

        try:
            image = Image.open(value)

            if image.format not in allowed_formats:
                raise serializers.ValidationError(
                    "Profile picture must be JPG, JPEG, or WEBP."
                )

            image.verify()

        except serializers.ValidationError:
            raise

        except Exception:
            raise serializers.ValidationError(
                "Invalid profile picture. Please upload a valid image."
            )

        finally:
            value.seek(0)

        return value