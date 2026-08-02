import api from "../api";

export const submitCareerDetails = async (data) => {
  const response = await api.post(
    "/candidate/profile-completion/career/",
    data
  );

  return response.data;
};