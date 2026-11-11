
import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "hireflow.settings",
)

app = Celery("hireflow")

app.config_from_object(
    "django.conf:settings",
    namespace="CELERY",
)

app.autodiscover_tasks()

app.conf.imports = (
    "candidate_app.services.ai.ai_interview_task",
    "company_app.tasks",
)

app.conf.beat_schedule = {
    "check-hr-interview-no-shows-every-minute": {
        "task": "company_app.tasks.process_hr_interview_no_shows",
        "schedule": crontab(minute="*"),
    },
}
