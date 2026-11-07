import api from "../api";

export const getPendingCompanies = async () => {
  const response = await api.get(
    "/admin/companies/pending/"
  );

  return response.data;
};

export const getCompanyDetails = async (
  companyId
) => {
  const response = await api.get(
    `/admin/companies/${companyId}/`
  );

  return response.data;
};

export const approveCompany = async (
  companyId
) => {
  const response = await api.patch(
    `/admin/companies/${companyId}/approve/`
  );

  return response.data;
};

export const rejectCompany = async (
  companyId,
  data
) => {
  const response = await api.patch(
    `/admin/companies/${companyId}/reject/`,
    data
  );

  return response.data;
};

export const getCompanies = async (
  search = "",
  status = "",
  page = 1
) => {
  const response = await api.get(
    `/admin/companies/?search=${search}&status=${status}&page=${page}`
  );

  return response.data;
};

export const suspendCompany = async (userId, reason) => {
  const response = await api.patch(
    `/admin/users/${userId}/status/`,
    {
      is_active: false,
      reason,
    }
  );

  return response.data;
};




export const activateCompany = async (userId) => {
  const response = await api.patch(
    `/admin/users/${userId}/status/`,
    {
      is_active: true,
    }
  );

  return response.data;
};


export const getCandidates = async (
  search = "",
  page = 1
) => {
  const response = await api.get(
    `/admin/candidates/?search=${search}&page=${page}`
  );

  return response.data;
};

export const getCandidateDetails = async (
  candidateId
) => {
  const response = await api.get(
    `/admin/candidates/${candidateId}/`
  );

  return response.data;
};


export const suspendCandidate = async (userId, reason) => {
  const response = await api.patch(
    `/admin/users/${userId}/status/`,
    {
      is_active: false,
      reason,
    }
  );

  return response.data;
};



export const activateCandidate = async (
  userId
) => {
  const response = await api.patch(
    `/admin/users/${userId}/status/`,
    {
      is_active: true,
    }
  );

  return response.data;
};


export const getCandidateApplications = async (candidateId) => {
  const response = await api.get(
    `/admin/candidates/${candidateId}/applications/`
  );

  return response.data;
};

export const getActiveJobsCount = async () => {
  const response = await api.get("/admin/jobs/active/count/");
  return response.data;
};

export const getCompanyJobDetails = async (companyId, jobId) => {
  const response = await api.get(
    `/admin/companies/${companyId}/jobs/${jobId}/`
  );

  return response.data;
};



// =====================================================
// ADMIN NOTIFICATIONS
// =====================================================

export const getAdminNotifications = async () => {
  const response = await api.get(
    "/admin/notifications/"
  );

  return response.data;
};

export const getAdminUnreadNotificationCount = async () => {
  const response = await api.get(
    "/admin/notifications/unread-count/"
  );

  return response.data;
};

export const markAdminNotificationAsRead = async (
  notificationId
) => {
  const response = await api.patch(
    `/admin/notifications/${notificationId}/read/`
  );

  return response.data;
};

export const markAllAdminNotificationsAsRead = async () => {
  const response = await api.patch(
    "/admin/notifications/read-all/"
  );

  return response.data;
};

export const deleteAdminNotification = async (
  notificationId
) => {
  const response = await api.delete(
    `/admin/notifications/${notificationId}/`
  );

  return response.data;
};

export const clearAllAdminNotifications = async () => {
  const response = await api.delete(
    "/admin/notifications/clear-all/"
  );

  return response.data;
};