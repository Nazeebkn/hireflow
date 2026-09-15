import api from "../api";

export const getJobApplications = async (jobId) => {
  const response = await api.get(
    `/company/jobs/${jobId}/applications/`
  );

  return response.data;
};