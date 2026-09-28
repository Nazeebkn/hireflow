import api from "../api";

export const applyForJob = async (jobId) => {
    const response = await api.post(
        `/candidate/jobs/${jobId}/apply/`
    );

    return response.data;
};


export const getCandidateApplications = async () => {
    const response = await api.get(
        "/candidate/applications/"
    );

    return response.data;
};


export const getCandidateApplicationById = async (
    applicationId
) => {
    const response = await api.get(
        `/candidate/applications/${applicationId}/`
    );

    return response.data;
};


// AI Resume Screening Report
export const getResumeScreeningReport = async (
    applicationId
) => {
    const response = await api.get(
        `/candidate/applications/${applicationId}/resume-screening/`
    );

    return response.data;
};


// Start AI Interview
export const startAIInterview = async (interviewId) => {
    const response = await api.post(
        `/candidate/interviews/${interviewId}/start/`
    );

    return response.data;
};