import api from "../api";

const COMPANY_PROFILE_ENDPOINT = "/company/profile/";


export const createCompanyProfile = async (formData) => {
  const response = await api.post(
    COMPANY_PROFILE_ENDPOINT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getCompanyProfile = async () => {
  const response = await api.get(
    COMPANY_PROFILE_ENDPOINT
  );

  return response.data;
};


export const updateCompanyProfile = async (formData) => {
  const response = await api.put(
    COMPANY_PROFILE_ENDPOINT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};