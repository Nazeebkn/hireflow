from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from candidate_app.services.candidate_job.candidate_job_service import (
    CandidateJobService,
)
from candidate_app.serializers.candidate_job.candidate_job_serializer import (
    CandidateJobSerializer,
)

from company_app.services.job_application.job_application_service import (
    JobApplicationService,
)
from company_app.serializers.job_application.job_application_serializer import (
    JobApplicationSerializer,
)



class CandidateJobAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        filters = {
            "search": request.query_params.get("search"),
            "location": request.query_params.get("location"),
            "work_mode": request.query_params.get("work_mode"),
            "employment_type": request.query_params.get(
                "employment_type"
            ),
            "min_salary": request.query_params.get("min_salary"),
            "max_salary": request.query_params.get("max_salary"),
            "sort": request.query_params.get("sort", "newest"),
        }

        jobs = CandidateJobService.get_published_jobs(filters)

        serializer = CandidateJobSerializer(
            jobs,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CandidateJobDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        job = CandidateJobService.get_published_job(job_id)

        serializer = CandidateJobSerializer(job)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CandidateJobApplicationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        application = JobApplicationService.apply_for_job(
            candidate=candidate,
            job_id=job_id,
        )

        serializer = JobApplicationSerializer(
            application
        )

        return Response(
            {
                "message": "Job application submitted successfully.",
                "application": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class CandidateApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        applications = (
            JobApplicationService.get_candidate_applications(
                candidate
            )
        )

        serializer = JobApplicationSerializer(
            applications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CandidateApplicationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, application_id):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        application = JobApplicationService.get_application(
            candidate=candidate,
            application_id=application_id,
        )

        serializer = JobApplicationSerializer(
            application
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
        
        
        
        
        
        
        
        
        