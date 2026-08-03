from django.db import transaction
from rest_framework.exceptions import ValidationError

from company_app.models import Company, ApprovalStatus
from company_app.repositories.profile.company_repository import CompanyRepository


class   CompanyService:

    @staticmethod
    @transaction.atomic
    def create_company_profile(user, validated_data):
        """
        Create company profile.
        """

        existing_company = CompanyRepository.get_company_by_user(user)

        if existing_company:
            raise ValidationError(
                {"message": "Company profile already exists."}
            )

        validated_data["user"] = user
        validated_data["approval_status"] = ApprovalStatus.PENDING

        return CompanyRepository.create_company(**validated_data)

    @staticmethod
    def get_company_profile(user):
        """
        Get logged in user's company profile.
        """

        company = CompanyRepository.get_company_by_user(user)

        if not company:
            raise ValidationError(
                {"message": "Company profile not found."}
            )

        return company

    @staticmethod
    @transaction.atomic
    def update_company_profile(company, validated_data):
        """
        Update company profile.
        If the company was previously rejected, it will be
        resubmitted for admin approval.
        """

        if company.approval_status == ApprovalStatus.REJECTED:
            validated_data["approval_status"] = ApprovalStatus.PENDING
            validated_data["rejection_reason"] = None

        return CompanyRepository.update_company(
            company,
            **validated_data
        )