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

export const suspendCompany = async (userId) => {
  const response = await api.patch(
    `/admin/users/${userId}/status/`,
    {
      is_active: false,
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

export const suspendCandidate = async (
  userId
) => {
  const response = await api.patch(
    `/admin/users/${userId}/status/`,
    {
      is_active: false,
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