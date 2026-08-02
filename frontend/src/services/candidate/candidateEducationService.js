import api from "../api";

export const createEducation = async (data) => {
  const response = await api.post(
    "/candidate/educations/",
    data
  );

  return response.data;
};

export const getEducations = async () => {
  const response = await api.get(
    "/candidate/educations/"
  );

  return response.data;
};

export const updateEducation = async (
  educationId,
  data
) => {
  const response = await api.put(
    `/candidate/educations/${educationId}/`,
    data
  );

  return response.data;
};

export const deleteEducation = async (
  educationId
) => {
  const response = await api.delete(
    `/candidate/educations/${educationId}/`
  );

  return response.data;
};