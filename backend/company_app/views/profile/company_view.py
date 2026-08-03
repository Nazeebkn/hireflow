from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company_app.serializers.profile.company_serializer import (
    CompanySerializer,
    CompanyDetailSerializer,
)
from company_app.services.profile.company_service import CompanyService


class CompanyAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_company(self):
        """
        Return the logged-in user's company profile.
        """
        return CompanyService.get_company_profile(self.request.user)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        company = CompanyService.create_company_profile(
            request.user,
            serializer.validated_data,
        )

        return Response(
            CompanyDetailSerializer(company).data,
            status=status.HTTP_201_CREATED,
        )

    def get(self, request):
        company = self.get_company()

        serializer = CompanyDetailSerializer(company)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        company = self.get_company()

        serializer = CompanySerializer(
            company,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        company = CompanyService.update_company_profile(
            company,
            serializer.validated_data,
        )

        return Response(
            CompanyDetailSerializer(company).data,
            status=status.HTTP_200_OK,
        )