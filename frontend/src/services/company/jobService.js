import api from "../api";

const JOBS_ENDPOINT = "/company/jobs/";


export const getCompanyJobs = async () => {

  const response = await api.get(
    JOBS_ENDPOINT
  );

  return response.data;
};


export const createJob = async (jobData) => {

  const response = await api.post(
    JOBS_ENDPOINT,
    jobData
  );

  return response.data;
};


export const updateJob = async (jobId, jobData) => {

  const response = await api.put(
    `${JOBS_ENDPOINT}${jobId}/`,
    jobData
  );

  return response.data;
};


export const publishJob = async (jobId) => {

  const response = await api.patch(
    `${JOBS_ENDPOINT}${jobId}/publish/`
  );

  return response.data;
};


export const closeJob = async (jobId) => {

  const response = await api.patch(
    `${JOBS_ENDPOINT}${jobId}/close/`
  );

  return response.data;
};