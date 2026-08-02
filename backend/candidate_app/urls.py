from django.urls import path

from .views import (
    CandidateProfileAPIView,
    CandidateResumeAPIView,
    CandidateEducationAPIView,
    CandidateEducationDetailAPIView,
    CandidateExperienceAPIView,
    CandidateExperienceDetailAPIView,
    CandidateSkillAPIView,
    CandidateSkillDetailAPIView,
    CandidateJobPreferenceAPIView,
    CareerProfileCompletionAPIView
)
urlpatterns = [

    path(
        "profile/",
        CandidateProfileAPIView.as_view(),
        name="candidate-profile",
    ),

    path(
        "profile/resume/",
        CandidateResumeAPIView.as_view(),
        name="candidate-resume",
    ),

    path(
        "educations/",
        CandidateEducationAPIView.as_view(),
        name="candidate-education",
    ),

    path(
        "educations/<int:education_id>/",
        CandidateEducationDetailAPIView.as_view(),
        name="candidate-education-detail",
    ),

    path(
        "experiences/",
        CandidateExperienceAPIView.as_view(),
        name="candidate-experience",
    ),

    path(
        "experiences/<int:experience_id>/",
        CandidateExperienceDetailAPIView.as_view(),
        name="candidate-experience-detail",
    ),

    path(
        "skills/",
        CandidateSkillAPIView.as_view(),
        name="candidate-skill",
    ),

    path(
        "skills/<int:skill_id>/",
        CandidateSkillDetailAPIView.as_view(),
        name="candidate-skill-detail",
    ),

    path(
        "job-preference/",
        CandidateJobPreferenceAPIView.as_view(),
        name="candidate-job-preference",
    ),
    
    path(
        "profile-completion/career/",
        CareerProfileCompletionAPIView.as_view(),
        name="career-profile-completion",
    ),

]