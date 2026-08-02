import api from "../api";

export const createJobPreference = async (data) => {
  const response = await api.post(
    "/candidate/job-preference/",
    data
  );

  return response.data;
};

export const getJobPreference = async () => {
  const response = await api.get(
    "/candidate/job-preference/"
  );

  return response.data;
};

export const updateJobPreference = async (data) => {
  const response = await api.put(
    "/candidate/job-preference/",
    data
  );

  return response.data;
};