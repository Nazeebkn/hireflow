from datetime import date
import re

from PIL import Image
from rest_framework import serializers

from candidate_app.models import CandidateProfile


class ProfilePictureField(serializers.ImageField):

    def to_representation(self, value):
        if not value:
            return None

        return str(value)


class CandidateProfileSerializer(serializers.ModelSerializer):

    # Used for uploading and returning the saved profile picture URL
    profile_picture = ProfilePictureField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = CandidateProfile

        fields = (
            "id",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
            "gender",
            "location",
            "profile_picture",
            "headline",
            "about",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "resume",
        )

    # -------------------------
    # First Name
    # -------------------------

    def validate_first_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "First name is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "First name must be at least 2 characters long."
            )

        if len(value) > 50:
            raise serializers.ValidationError(
                "First name cannot exceed 50 characters."
            )

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise serializers.ValidationError(
                "First name must contain only letters and spaces."
            )

        return value

    # -------------------------
    # Last Name
    # -------------------------

    def validate_last_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Last name is required."
            )

        if len(value) < 1:
            raise serializers.ValidationError(
                "Last name is required."
            )

        if len(value) > 50:
            raise serializers.ValidationError(
                "Last name cannot exceed 50 characters."
            )

        if not re.fullmatch(r"[A-Za-z ]+", value):
            raise serializers.ValidationError(
                "Last name must contain only letters and spaces."
            )

        return value

    # -------------------------
    # Phone Number
    # -------------------------

    def validate_phone_number(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Phone number is required."
            )

        if not re.fullmatch(r"\d{10,15}", value):
            raise serializers.ValidationError(
                "Phone number must contain between 10 and 15 digits."
            )

        return value

    # -------------------------
    # Date of Birth
    # -------------------------

    def validate_date_of_birth(self, value):

        if value > date.today():
            raise serializers.ValidationError(
                "Date of birth cannot be in the future."
            )

        return value

    # -------------------------
    # Location
    # -------------------------

    def validate_location(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Location is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Location must be at least 2 characters long."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Location cannot exceed 255 characters."
            )

        return value

    # -------------------------
    # Headline
    # -------------------------

    def validate_headline(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Professional headline is required."
            )

        if len(value) < 5:
            raise serializers.ValidationError(
                "Professional headline must be at least 5 characters long."
            )

        if len(value) > 255:
            raise serializers.ValidationError(
                "Professional headline cannot exceed 255 characters."
            )

        if not re.search(r"[A-Za-z]", value):
            raise serializers.ValidationError(
                "Professional headline must contain at least one letter."
            )

        return value

    # -------------------------
    # About
    # -------------------------

    def validate_about(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "About me is required."
            )

        if len(value) < 15:
            raise serializers.ValidationError(
                "About me must be at least 15 characters long."
            )

        if len(value) > 5000:
            raise serializers.ValidationError(
                "About me cannot exceed 5000 characters."
            )

        if not re.search(r"[A-Za-z]", value):
            raise serializers.ValidationError(
                "About me must contain at least one letter."
            )

        return value

    # -------------------------
    # LinkedIn
    # -------------------------

    def validate_linkedin_url(self, value):

        value = value.strip()

        if not value:
            return value

        if len(value) > 500:
            raise serializers.ValidationError(
                "LinkedIn URL cannot exceed 500 characters."
            )

        if not re.fullmatch(
            r"https?://(www\.)?linkedin\.com/.*",
            value,
            re.IGNORECASE
        ):
            raise serializers.ValidationError(
                "Please enter a valid LinkedIn URL."
            )

        return value

    # -------------------------
    # GitHub
    # -------------------------

    def validate_github_url(self, value):

        value = value.strip()

        if not value:
            return value

        if len(value) > 500:
            raise serializers.ValidationError(
                "GitHub URL cannot exceed 500 characters."
            )

        if not re.fullmatch(
            r"https?://(www\.)?github\.com/.*",
            value,
            re.IGNORECASE
        ):
            raise serializers.ValidationError(
                "Please enter a valid GitHub URL."
            )

        return value

    # -------------------------
    # Portfolio
    # -------------------------

    def validate_portfolio_url(self, value):

        value = value.strip()

        if not value:
            return value

        if len(value) > 500:
            raise serializers.ValidationError(
                "Portfolio URL cannot exceed 500 characters."
            )

        return value

    # -------------------------
    # Profile Picture
    # -------------------------

    def validate_profile_picture(self, value):

        if value is None:
            return value

        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Profile picture must be less than 5 MB."
            )

        allowed_formats = [
            "JPEG",
            "PNG",
            "WEBP",
        ]

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