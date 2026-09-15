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
    CareerProfileCompletionAPIView,
    CandidateProfileCompletionAPIView,
)

from candidate_app.candidate_views.candidate_dashboard.candidate_dashboard_view import (
    CandidateDashboardAPIView,
)

from candidate_app.candidate_views.candidate_job.candidate_job_view import (
    CandidateJobAPIView,
    CandidateJobDetailAPIView,
    CandidateJobApplicationAPIView,
    CandidateApplicationsAPIView,
    CandidateApplicationDetailAPIView,
)


urlpatterns = [

    # Candidate Profile

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

    # Education

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

    # Experience

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

    # Skills

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

    # Job Preference

    path(
        "job-preference/",
        CandidateJobPreferenceAPIView.as_view(),
        name="candidate-job-preference",
    ),

    # Profile Completion

    path(
        "profile-completion/career/",
        CareerProfileCompletionAPIView.as_view(),
        name="career-profile-completion",
    ),

    path(
        "profile-completion/complete/",
        CandidateProfileCompletionAPIView.as_view(),
        name="candidate-profile-complete",
    ),

    # Dashboard

    path(
        "dashboard/",
        CandidateDashboardAPIView.as_view(),
        name="candidate-dashboard",
    ),

    # Jobs

    path(
        "jobs/",
        CandidateJobAPIView.as_view(),
        name="candidate-jobs",
    ),

    path(
        "jobs/<int:job_id>/",
        CandidateJobDetailAPIView.as_view(),
        name="candidate-job-detail",
    ),

    # Job Application

    path(
        "jobs/<int:job_id>/apply/",
        CandidateJobApplicationAPIView.as_view(),
        name="candidate-job-apply",
    ),
    
    path(
    "applications/",
    CandidateApplicationsAPIView.as_view(),
    name="candidate-applications",
    ),

    path(
        "applications/<int:application_id>/",
        CandidateApplicationDetailAPIView.as_view(),
        name="candidate-application-detail",
    ),
]