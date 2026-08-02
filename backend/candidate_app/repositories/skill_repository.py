from candidate_app.models import Skill


class SkillRepository:

    @staticmethod
    def get_or_create(skill_name):

        skill, _ = Skill.objects.get_or_create(
            name=skill_name.strip()
        )

        return skill