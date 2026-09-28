import api from "../api";

export const getJobApplications = async (jobId) => {
  const response = await api.get(
    `/company/jobs/${jobId}/applications/`
  );

  return response.data;
};

export const getCompanyApplicationById = async (
  applicationId
) => {
  const response = await api.get(
    `/company/applications/${applicationId}/`
  );

  return response.data;
};

export const getCompanyResumeScreeningReport = async (
  applicationId
) => {
  const response = await api.get(
    `/company/applications/${applicationId}/resume-screening/`
  );

  return response.data;
};