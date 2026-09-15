from rest_framework import serializers

from company_app.serializers.job_application.job_application_serializer import (
    JobApplicationSerializer,
)


class DashboardStatsSerializer(serializers.Serializer):

    total_jobs = serializers.IntegerField()
    draft_jobs = serializers.IntegerField()
    published_jobs = serializers.IntegerField()
    closed_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    active_jobs = serializers.IntegerField()


class DashboardAttentionJobSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    title = serializers.CharField()
    reason = serializers.CharField()
    status = serializers.CharField()
    application_deadline = serializers.DateField(
        required=False,
        allow_null=True,
    )
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class DashboardActivitySerializer(serializers.Serializer):

    id = serializers.IntegerField()
    title = serializers.CharField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class DashboardSerializer(serializers.Serializer):

    stats = DashboardStatsSerializer()

    recent_applications = JobApplicationSerializer(
        many=True
    )

    attention_jobs = DashboardAttentionJobSerializer(
        many=True
    )

    recent_activity = DashboardActivitySerializer(
        many=True
    )