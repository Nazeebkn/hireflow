export const validateEmail = (email) => {
  const value = email.trim();

  if (!value) {
    return "Email is required.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
};


export const validatePassword = (password) => {
  const value = password;

  if (!value || !value.trim()) {
    return "Password is required.";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(value)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number.";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return "Password must contain at least one special character.";
  }

  return "";
};


export const validateConfirmPassword = (
  password,
  confirmPassword
) => {
  if (!confirmPassword.trim()) {
    return "Confirm password is required.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};