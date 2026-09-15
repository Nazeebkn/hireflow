import api from "../api";

export const getCandidateDashboard = async () => {
    const response = await api.get("/candidate/dashboard/");
    return response.data;
};