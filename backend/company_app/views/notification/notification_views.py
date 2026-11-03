from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company_app.serializers.notification.notification_serializer import (
    CompanyNotificationSerializer,
)
from company_app.services.notification.notification_service import (
    CompanyNotificationService,
)


class CompanyNotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if not company:
            return Response(
                {"message": "Company profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notifications = (
            CompanyNotificationService
            .get_user_notifications(
                user=request.user
            )
        )

        serializer = CompanyNotificationSerializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CompanyNotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if not company:
            return Response(
                {"message": "Company profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification = (
            CompanyNotificationService.mark_as_read(
                user=request.user,
                notification_id=notification_id,
            )
        )

        if not notification:
            return Response(
                {"message": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CompanyNotificationSerializer(
            notification
        )

        return Response(
            {
                "message": "Notification marked as read.",
                "notification": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class CompanyNotificationMarkAllReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if not company:
            return Response(
                {"message": "Company profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        CompanyNotificationService.mark_all_as_read(
            user=request.user
        )

        return Response(
            {
                "message": (
                    "All notifications marked as read."
                )
            },
            status=status.HTTP_200_OK,
        )


class CompanyNotificationUnreadCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if not company:
            return Response(
                {"message": "Company profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        unread_count = (
            CompanyNotificationService
            .get_unread_count(
                user=request.user
            )
        )

        return Response(
            {
                "unread_count": unread_count
            },
            status=status.HTTP_200_OK,
        )


class CompanyNotificationClearAllAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if not company:
            return Response(
                {"message": "Company profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        CompanyNotificationService.delete_all_notifications(
            user=request.user
        )

        return Response(
            {
                "message": (
                    "All notifications cleared successfully."
                )
            },
            status=status.HTTP_200_OK,
        )


class CompanyNotificationDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, notification_id):

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if not company:
            return Response(
                {"message": "Company profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification = (
            CompanyNotificationService
            .get_notification_by_user(
                notification_id=notification_id,
                user=request.user,
            )
        )

        if not notification:
            return Response(
                {"message": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        CompanyNotificationService.delete_notification(
            notification=notification
        )

        return Response(
            {
                "message": (
                    "Notification deleted successfully."
                )
            },
            status=status.HTTP_200_OK,
        )