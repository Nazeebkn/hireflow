import api from "../api";

export const getCompanyHRInterviews = async () => {
  const response = await api.get("/company/hr-interviews/");
  return response.data;
};

export const scheduleCompanyHRInterview = async (
  applicationId,
  interviewData
) => {
  const response = await api.post(
    `/company/applications/${applicationId}/hr-interview/`,
    interviewData
  );

  return response.data;
};

export const cancelCompanyHRInterview = async (
  applicationId,
  cancellationData
) => {
  const response = await api.post(
    `/company/applications/${applicationId}/hr-interview/cancel/`,
    cancellationData
  );

  return response.data;
};