from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError

from company_app.serializers.job.job_serializer import JobSerializer
from company_app.services.job.job_service import JobService
from company_app.repositories.job.job_repository import JobRepository

class JobCreateAPIView(APIView):

    def post(self, request):

        serializer = JobSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            job = JobService.create_job(
                request.user,
                serializer.validated_data
            )

        except ValidationError as exc:
            return Response(
                {"message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Job created successfully.",
                "job": JobSerializer(job).data
            },
            status=status.HTTP_201_CREATED
        )
        
    
    def get(self, request):

        try:
            jobs = JobService.get_company_jobs(
                request.user
            )

        except ValidationError as exc:
            return Response(
                {"message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(
            {
                "jobs": serializer.data
            },
            status=status.HTTP_200_OK
        )
            
            
            
class JobUpdateAPIView(APIView):

    def put(self, request, job_id):

        job = JobRepository.get_job_by_id(job_id)

        if not job:
            return Response(
                {"message": "Job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = JobSerializer(
            job,
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            job = JobService.update_job(
                request.user,
                job,
                serializer.validated_data
            )

        except ValidationError as exc:
            return Response(
                {"message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Job updated successfully.",
                "job": JobSerializer(job).data
            },
            status=status.HTTP_200_OK
        )
        
        
        
        
class JobPublishAPIView(APIView):

    def patch(self, request, job_id):

        job = JobRepository.get_job_by_id(job_id)

        if not job:
            return Response(
                {"message": "Job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            job = JobService.publish_job(
                request.user,
                job
            )

        except ValidationError as exc:
            return Response(
                {"message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Job published successfully.",
                "job": JobSerializer(job).data
            },
            status=status.HTTP_200_OK
        )
        
        


class JobCloseAPIView(APIView):

    def patch(self, request, job_id):

        job = JobRepository.get_job_by_id(job_id)

        if not job:
            return Response(
                {"message": "Job not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            job = JobService.close_job(
                request.user,
                job
            )

        except ValidationError as exc:
            return Response(
                {"message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Job closed successfully.",
                "job": JobSerializer(job).data
            },
            status=status.HTTP_200_OK
        )
        
        