import api from "../api";

export const createSkill = async (data) => {
  const response = await api.post(
    "/candidate/skills/",
    data
  );

  return response.data;
};

export const getSkills = async () => {
  const response = await api.get(
    "/candidate/skills/"
  );

  return response.data;
};

export const updateSkill = async (
  skillId,
  data
) => {
  const response = await api.put(
    `/candidate/skills/${skillId}/`,
    data
  );

  return response.data;
};

export const deleteSkill = async (
  skillId
) => {
  const response = await api.delete(
    `/candidate/skills/${skillId}/`
  );

  return response.data;
};