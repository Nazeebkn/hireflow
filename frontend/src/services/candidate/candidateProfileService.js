import api from "../api";

export const createCandidateProfile = async (formData) => {
  const response = await api.post(
    "/candidate/profile/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateCandidateProfile = async (formData) => {
  const response = await api.put(
    "/candidate/profile/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getCandidateProfile = async () => {
  const response = await api.get("/candidate/profile/");
  return response.data;
};