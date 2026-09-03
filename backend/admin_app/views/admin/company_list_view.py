from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from admin_app.services.admin.company_list_service import (
    CompanyListService,
)

from admin_app.serializers.admin.company_list_serializer import (
    CompanyListSerializer,
)

from rest_framework.permissions import IsAuthenticated

from admin_app.permissions import IsAdminUser


class CompanyListAPIView(APIView):
    
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get(self, request):

        search = request.query_params.get(
            "search"
        )

        company_status = request.query_params.get(
            "status"
        )

        page = int(
            request.query_params.get(
                "page",
                1,
            )
        )

        companies = CompanyListService.get_all_companies(
            search=search,
            status=company_status,
            page=page,
        )

        serializer = CompanyListSerializer(
            companies,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )