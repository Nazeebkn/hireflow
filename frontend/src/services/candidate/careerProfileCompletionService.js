import api from "../api";

export const submitCareerDetails = async (data) => {
  const response = await api.post(
    "/candidate/profile/career-completion/",
    data
  );

  return response.data;
};