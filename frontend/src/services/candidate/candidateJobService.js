import api from "../api";

export const getCandidateJobs = async (params = {}) => {
    const response = await api.get("/candidate/jobs/", {
        params,
    });

    return response.data;
};

export const getCandidateJobById = async (jobId) => {
    const response = await api.get(`/candidate/jobs/${jobId}/`);
    return response.data;
};