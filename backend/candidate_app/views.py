from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from candidate_app.services.candidate_profile_service import CandidateProfileService
from candidate_app.services.candidate_education_service import CandidateEducationService
from candidate_app.services.candidate_experience_service import CandidateExperienceService
from candidate_app.services.candidate_skill_service import CandidateSkillService
from candidate_app.services.candidate_job_preference_service import CandidateJobPreferenceService

from candidate_app.serializers.candidate_profile_serializer import CandidateProfileSerializer
from candidate_app.serializers.candidate_education_serializer import CandidateEducationSerializer
from candidate_app.serializers.candidate_experience_serializer import CandidateExperienceSerializer
from candidate_app.serializers.candidate_skill_serializer import CandidateSkillSerializer
from candidate_app.serializers.candidate_resume_serializer import CandidateResumeSerializer
from candidate_app.serializers.candidate_job_preference_serializer import CandidateJobPreferenceSerializer

class CandidateProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CandidateProfileSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        profile = CandidateProfileService.create_profile(
            request.user,
            serializer.validated_data
        )

        return Response(
            CandidateProfileSerializer(profile).data,
            status=status.HTTP_201_CREATED
        )
        
        
    def get(self, request):

        profile = CandidateProfileService.get_profile(
            request.user
        )

        serializer = CandidateProfileSerializer(profile)

        return Response(serializer.data)
    
    
    def put(self, request):

        serializer = CandidateProfileSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        profile = CandidateProfileService.update_profile(
            request.user,
            serializer.validated_data
        )

        return Response(
            CandidateProfileSerializer(profile).data,
            status=status.HTTP_200_OK
        )
        
        
        
class CandidateEducationAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CandidateEducationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        education = CandidateEducationService.create_education(
            request.user,
            serializer.validated_data
        )

        return Response(
            CandidateEducationSerializer(education).data,
            status=status.HTTP_201_CREATED
        )

    def get(self, request):

        educations = CandidateEducationService.get_all_educations(
            request.user
        )

        serializer = CandidateEducationSerializer(
            educations,
            many=True
        )

        return Response(serializer.data)
    
    
    
    
class CandidateEducationDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]
    
    def get(self, request, education_id):

        education = CandidateEducationService.get_education(
            request.user,
            education_id
        )

        serializer = CandidateEducationSerializer(
            education
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


    def put(self, request, education_id):

        serializer = CandidateEducationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        education = CandidateEducationService.update_education(
            request.user,
            education_id,
            serializer.validated_data
        )

        return Response(
            CandidateEducationSerializer(education).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, education_id):

        CandidateEducationService.delete_education(
            request.user,
            education_id
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
        
        
        
    
class CandidateExperienceAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CandidateExperienceSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        experience = CandidateExperienceService.create_experience(
            request.user,
            serializer.validated_data
        )

        return Response(
            CandidateExperienceSerializer(experience).data,
            status=status.HTTP_201_CREATED
        )

    def get(self, request):

        experiences = CandidateExperienceService.get_all_experiences(
            request.user
        )

        serializer = CandidateExperienceSerializer(
            experiences,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
        
        
        
        
class CandidateExperienceDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, experience_id):

        experience = CandidateExperienceService.get_experience(
            request.user,
            experience_id
        )

        serializer = CandidateExperienceSerializer(
            experience
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, experience_id):

        serializer = CandidateExperienceSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        experience = CandidateExperienceService.update_experience(
            request.user,
            experience_id,
            serializer.validated_data
        )

        return Response(
            CandidateExperienceSerializer(experience).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, experience_id):

        CandidateExperienceService.delete_experience(
            request.user,
            experience_id
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
        
        
        
        
class CandidateSkillAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CandidateSkillSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        candidate_skill = CandidateSkillService.create_skill(
            request.user,
            serializer.validated_data
        )

        return Response(
            CandidateSkillSerializer(candidate_skill).data,
            status=status.HTTP_201_CREATED
        )

    def get(self, request):

        candidate_skills = CandidateSkillService.get_all_skills(
            request.user
        )

        serializer = CandidateSkillSerializer(
            candidate_skills,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
        
        
        

class CandidateSkillDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, skill_id):

        candidate_skill = CandidateSkillService.get_skill(
            request.user,
            skill_id
        )

        serializer = CandidateSkillSerializer(
            candidate_skill
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, skill_id):

        serializer = CandidateSkillSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        candidate_skill = CandidateSkillService.update_skill(
            request.user,
            skill_id,
            serializer.validated_data
        )

        return Response(
            CandidateSkillSerializer(candidate_skill).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, skill_id):

        CandidateSkillService.delete_skill(
            request.user,
            skill_id
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
        
        
        
class CandidateResumeAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def patch(self, request):

        serializer = CandidateResumeSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        profile = CandidateProfileService.update_resume(
            request.user,
            serializer.validated_data["resume"]
        )

        return Response(
            CandidateResumeSerializer(profile).data,
            status=status.HTTP_200_OK
        )
        
        

class CandidateJobPreferenceAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CandidateJobPreferenceSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        preference = CandidateJobPreferenceService.create_preference(
            request.user,
            serializer.validated_data
        )

        return Response(
            CandidateJobPreferenceSerializer(preference).data,
            status=status.HTTP_201_CREATED
        )

    def get(self, request):

        preference = CandidateJobPreferenceService.get_preference(
            request.user
        )

        serializer = CandidateJobPreferenceSerializer(
            preference
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request):

        serializer = CandidateJobPreferenceSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        preference = CandidateJobPreferenceService.update_preference(
            request.user,
            serializer.validated_data
        )

        return Response(
            CandidateJobPreferenceSerializer(preference).data,
            status=status.HTTP_200_OK
        )