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

from candidate_app.candidate_views.notification.notification_views import (
    CandidateNotificationListAPIView,
    CandidateNotificationReadAPIView,
    CandidateNotificationMarkAllReadAPIView,
    CandidateNotificationUnreadCountAPIView,
    CandidateNotificationClearAllAPIView,
    CandidateNotificationDeleteAPIView,
)

# ============================================================
# AI VIEWS
# ============================================================

from candidate_app.candidate_views.ai.ai_interview_views import (
    StartAIInterviewAPIView,
)

from candidate_app.candidate_views.ai.resume_screening_view import (
    ResumeScreeningReportAPIView,
)

from candidate_app.candidate_views.ai.ai_interview_question_views import (
    AIInterviewQuestionsAPIView,
)

from candidate_app.candidate_views.ai.ai_interview_answer_views import (
    SubmitAIInterviewAnswerAPIView,
)

urlpatterns = [

    # ============================================================
    # CANDIDATE PROFILE
    # ============================================================

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
        "profile/education/",
        CandidateEducationAPIView.as_view(),
        name="candidate-education",
    ),

    path(
        "profile/education/<int:education_id>/",
        CandidateEducationDetailAPIView.as_view(),
        name="candidate-education-detail",
    ),

    path(
        "profile/experience/",
        CandidateExperienceAPIView.as_view(),
        name="candidate-experience",
    ),

    path(
        "profile/experience/<int:experience_id>/",
        CandidateExperienceDetailAPIView.as_view(),
        name="candidate-experience-detail",
    ),

    path(
        "profile/skills/",
        CandidateSkillAPIView.as_view(),
        name="candidate-skills",
    ),

    path(
        "profile/skills/<int:skill_id>/",
        CandidateSkillDetailAPIView.as_view(),
        name="candidate-skill-detail",
    ),

    path(
        "profile/job-preference/",
        CandidateJobPreferenceAPIView.as_view(),
        name="candidate-job-preference",
    ),

    path(
        "profile/career-completion/",
        CareerProfileCompletionAPIView.as_view(),
        name="career-profile-completion",
    ),

    path(
        "profile/completion/",
        CandidateProfileCompletionAPIView.as_view(),
        name="candidate-profile-completion",
    ),


    # ============================================================
    # CANDIDATE DASHBOARD
    # ============================================================

    path(
        "dashboard/",
        CandidateDashboardAPIView.as_view(),
        name="candidate-dashboard",
    ),


    # ============================================================
    # JOBS
    # ============================================================

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

    path(
        "jobs/<int:job_id>/apply/",
        CandidateJobApplicationAPIView.as_view(),
        name="candidate-job-application",
    ),


    # ============================================================
    # APPLICATIONS
    # ============================================================

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


    # ============================================================
    # AI RESUME SCREENING
    # ============================================================

    path(
        "applications/<int:application_id>/resume-screening/",
        ResumeScreeningReportAPIView.as_view(),
        name="candidate-resume-screening-report",
    ),


    # ============================================================
    # AI INTERVIEW
    # ============================================================

    path(
        "interviews/<int:interview_id>/start/",
        StartAIInterviewAPIView.as_view(),
        name="start-ai-interview",
    ),


    # ============================================================
    # NOTIFICATIONS
    # ============================================================

    path(
        "notifications/",
        CandidateNotificationListAPIView.as_view(),
        name="candidate-notifications",
    ),

    path(
        "notifications/<int:notification_id>/read/",
        CandidateNotificationReadAPIView.as_view(),
        name="candidate-notification-read",
    ),

    path(
        "notifications/read-all/",
        CandidateNotificationMarkAllReadAPIView.as_view(),
        name="candidate-notification-mark-all-read",
    ),

    path(
        "notifications/unread-count/",
        CandidateNotificationUnreadCountAPIView.as_view(),
        name="candidate-notification-unread-count",
    ),

    path(
        "notifications/clear-all/",
        CandidateNotificationClearAllAPIView.as_view(),
        name="candidate-notification-clear-all",
    ),

    path(
        "notifications/<int:notification_id>/",
        CandidateNotificationDeleteAPIView.as_view(),
        name="candidate-notification-delete",
    ),
    
    path(
    "interviews/<int:interview_id>/questions/",
    AIInterviewQuestionsAPIView.as_view(),
    name="ai-interview-questions",
),
    
    path(
    "interviews/questions/<int:question_id>/answer/",
    SubmitAIInterviewAnswerAPIView.as_view(),
    name="submit-ai-interview-answer",
),
]