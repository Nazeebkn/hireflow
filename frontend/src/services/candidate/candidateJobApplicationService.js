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