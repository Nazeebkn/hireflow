import api from "../api";

export const createExperience = async (data) => {
  const response = await api.post(
    "/candidate/experiences/",
    data
  );

  return response.data;
};

export const getExperiences = async () => {
  const response = await api.get(
    "/candidate/experiences/"
  );

  return response.data;
};

export const updateExperience = async (
  experienceId,
  data
) => {
  const response = await api.put(
    `/candidate/experiences/${experienceId}/`,
    data
  );

  return response.data;
};

export const deleteExperience = async (
  experienceId
) => {
  const response = await api.delete(
    `/candidate/experiences/${experienceId}/`
  );

  return response.data;
};