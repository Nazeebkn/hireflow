import api from "../api";

const DASHBOARD_ENDPOINT = "/company/dashboard/";


export const getCompanyDashboard = async () => {

  const response = await api.get(
    DASHBOARD_ENDPOINT
  );

  return response.data;
};