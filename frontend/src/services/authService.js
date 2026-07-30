import api from "./api";



export const signup = async (email, password, role) => {
  const response = await api.post("/auth/signup/", {
    email,
    password,
    role,
  });

  return response.data;
};



export const login = async (email, password) => {
  const response = await api.post("/auth/login/", {
    email,
    password,
  });

  return response.data;
};


export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password/", {
    email,
  });

  return response.data;
};



export const resetPassword = async (
  uid,
  token,
  newPassword,
  confirmPassword
) => {
  const response = await api.post("/auth/reset-password/", {
    uid,
    token,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });

  return response.data;
};



export const googleSignup = async (token, role) => {
  const response = await api.post("/auth/google-signup/", {
    token,
    role,
  });

  return response.data;
};



export const googleLogin = async (token) => {
  const response = await api.post("/auth/google-login/", {
    token,
  });

  return response.data;
};