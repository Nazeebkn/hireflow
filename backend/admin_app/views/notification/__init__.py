from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from candidate_app.serializers.notification.notification_serializer import (
    NotificationSerializer,
)

from admin_app.services.notification.notification_service import (
    AdminNotificationService,
)

from users.models import User


class AdminNotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != User.UserRole.ADMIN:
            return Response(
                {"message": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notifications = (
            AdminNotificationService
            .get_user_notifications(
                user=request.user
            )
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class AdminNotificationUnreadCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != User.UserRole.ADMIN:
            return Response(
                {"message": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        unread_count = (
            AdminNotificationService
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


class AdminNotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):

        if request.user.role != User.UserRole.ADMIN:
            return Response(
                {"message": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notification = (
            AdminNotificationService
            .mark_as_read(
                user=request.user,
                notification_id=notification_id,
            )
        )

        if not notification:
            return Response(
                {"message": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = NotificationSerializer(
            notification
        )

        return Response(
            {
                "message": "Notification marked as read.",
                "notification": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class AdminNotificationMarkAllReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):

        if request.user.role != User.UserRole.ADMIN:
            return Response(
                {"message": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        AdminNotificationService.mark_all_as_read(
            user=request.user
        )

        return Response(
            {
                "message": "All notifications marked as read."
            },
            status=status.HTTP_200_OK,
        )


class AdminNotificationDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, notification_id):

        if request.user.role != User.UserRole.ADMIN:
            return Response(
                {"message": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notification = (
            AdminNotificationService
            .get_notification_by_id(
                user=request.user,
                notification_id=notification_id,
            )
        )

        if not notification:
            return Response(
                {"message": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        AdminNotificationService.delete_notification(
            notification
        )

        return Response(
            {
                "message": "Notification deleted successfully."
            },
            status=status.HTTP_200_OK,
        )


class AdminNotificationClearAllAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):

        if request.user.role != User.UserRole.ADMIN:
            return Response(
                {"message": "Admin access required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        AdminNotificationService.delete_all_notifications(
            user=request.user
        )

        return Response(
            {
                "message": "All notifications cleared successfully."
            },
            status=status.HTTP_200_OK,
        )