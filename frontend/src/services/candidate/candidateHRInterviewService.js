import api from "../api";

/**
 * Fetch HR interviews belonging to the authenticated candidate.
 */
export const getCandidateHRInterviews = async () => {
    const response = await api.get(
        "/candidate/hr-interviews/"
    );

    return response.data;
};

/**
 * Generate LiveKit access token for a candidate HR interview.
 */
export const getCandidateHRInterviewToken = async (interviewId) => {
    const response = await api.post(
        `/candidate/hr-interviews/${interviewId}/token/`
    );

    return response.data;
};