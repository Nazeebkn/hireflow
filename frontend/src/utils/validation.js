export const validateEmail = (email) => {
  const value = (email || "").trim();

  if (!value) {
    return "Email address is required.";
  }

  // Leading / trailing spaces
  if (email !== value) {
    return "Email address cannot start or end with spaces.";
  }

  // Consecutive spaces
  if (/\s{2,}/.test(email)) {
    return "Email address cannot contain spaces.";
  }

  // Email format
  const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailPattern.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
};



export const validatePassword = (password) => {
  const value = password || "";

  if (!value.trim()) {
    return "Password is required.";
  }

  if (value !== value.trim()) {
    return "Password cannot start or end with spaces.";
  }

  if (/\s/.test(value)) {
    return "Password cannot contain spaces.";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (value.length > 128) {
    return "Password cannot exceed 128 characters.";
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
  const value = confirmPassword || "";

  if (!value.trim()) {
    return "Confirm Password is required.";
  }

  if (value !== value.trim()) {
    return "Confirm Password cannot start or end with spaces.";
  }

  if (/\s/.test(value)) {
    return "Confirm Password cannot contain spaces.";
  }

  if (password !== value) {
    return "Passwords do not match.";
  }

  return "";
};


export const validateName = (
  name,
  field = "Name",
  minLength = 2
) => {
  const value = (name || "").trim();

  if (!value) {
    return `${field} is required.`;
  }

  if (name !== value) {
    return `${field} cannot start or end with spaces.`;
  }

  if (/\s{2,}/.test(value)) {
    return `${field} cannot contain multiple consecutive spaces.`;
  }

  if (value.length < minLength) {
    return `${field} must be at least ${minLength} character${minLength > 1 ? "s" : ""}.`;
  }

  const maxLength = 50;

  if (value.length > maxLength) {
    return `${field} cannot exceed ${maxLength} characters.`;
  }

  // Only letters and single spaces
  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value)) {
    return `${field} can only contain letters and single spaces.`;
  }

  // Reject repeated characters (aaaa, bbbb, zzzzzz)
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return `Enter a valid ${field.toLowerCase()}.`;
  }

  return "";
};




export const validatePhone = (phone) => {
  const value = (phone || "").trim();

  if (!value) {
    return "Phone number is required.";
  }

  if (phone !== value) {
    return "Phone number cannot start or end with spaces.";
  }

  if (/\s/.test(value)) {
    return "Phone number cannot contain spaces.";
  }

  if (!/^\d+$/.test(value)) {
    return "Phone number must contain only digits.";
  }

  if (value.length !== 10) {
    return "Phone number must be exactly 10 digits.";
  }

  if (!/^[6-9]\d{9}$/.test(value)) {
    return "Please enter a valid Indian phone number.";
  }

  return "";
};



export const validateDateOfBirth = (dob) => {
  const value = (dob || "").trim();

  if (!value) {
    return "Date of Birth is required.";
  }

  const birthDate = new Date(value);

  if (Number.isNaN(birthDate.getTime())) {
    return "Please enter a valid Date of Birth.";
  }

  const today = new Date();

  // Date of Birth cannot be today or a future date
  if (birthDate >= today) {
    return "Date of Birth cannot be today or a future date.";
  }

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < 18) {
    return "You must be at least 18 years old.";
  }

  if (age > 70) {
    return "Please enter a valid Date of Birth.";
  }

  return "";
};


export const validateAbout = (about) => {
  const value = (about || "").trim();

  if (!value) {
    return "About Me is required.";
  }

  if (about !== value) {
    return "About Me cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "About Me cannot contain multiple consecutive spaces.";
  }

  if (value.length < 50) {
    return "About Me must be at least 50 characters.";
  }

  if (value.length > 500) {
    return "About Me cannot exceed 500 characters.";
  }

  // Must contain at least one letter
  if (!/[A-Za-z]/.test(value)) {
    return "About Me must contain meaningful text.";
  }

  // Reject repeated characters
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid About Me.";
  }

  // Reject summaries made of only symbols
  if (!/^[A-Za-z0-9\s.,'()/#&%:+\-]+$/.test(value)) {
    return "About Me contains invalid characters.";
  }

  return "";
};



export const validateHeadline = (headline) => {
  const value = (headline || "").trim();

  if (!value) {
    return "Professional Headline is required.";
  }

  if (headline !== value) {
    return "Professional Headline cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Professional Headline cannot contain multiple consecutive spaces.";
  }

  if (value.length < 8) {
    return "Professional Headline must be at least 8 characters.";
  }

  if (value.length > 100) {
    return "Professional Headline cannot exceed 100 characters.";
  }

  // Must contain at least one letter
  if (!/[A-Za-z]/.test(value)) {
    return "Professional Headline must contain letters.";
  }

  // Reject repeated characters
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid Professional Headline.";
  }

  // Allow only professional characters
  if (!/^[A-Za-z0-9\s.,&()#+/-]+$/.test(value)) {
    return "Professional Headline contains invalid characters.";
  }

  return "";
};


export const validateProfilePhoto = (file) => {
  if (!file) {
    return "Profile photo is required.";
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, JPEG and PNG image files are allowed.";
  }

  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (file.size > maxSize) {
    return "Profile photo must not exceed 5 MB.";
  }

  // Prevent empty/corrupted files
  if (file.size === 0) {
    return "Selected image is invalid.";
  }

  return "";
};



export const validateLocation = (location) => {
  const value = (location || "").trim();

  if (!value) {
    return "Location is required.";
  }

  if (location !== value) {
    return "Location cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Location cannot contain multiple consecutive spaces.";
  }

  if (value.length < 3) {
    return "Location must be at least 3 characters.";
  }

  if (value.length > 100) {
    return "Location cannot exceed 100 characters.";
  }

  // Must start with a letter
  if (!/^[A-Za-z]/.test(value)) {
    return "Location must start with a letter.";
  }

  // Allow only letters, spaces, periods, hyphens and commas
  if (!/^[A-Za-z][A-Za-z\s.,-]*$/.test(value)) {
    return "Location contains invalid characters.";
  }

  // Reject repeated characters (aaaa, bbbb)
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid location.";
  }

  return "";
};



export const validateEducation = (education) => {
  const value = (education || "").trim();

  if (!value) {
    return "Please select your highest education qualification.";
  }

  const validEducationLevels = Object.freeze([
    "HIGH_SCHOOL",
    "HIGHER_SECONDARY",
    "DIPLOMA",
    "BACHELORS",
    "MASTERS",
    "PHD",
  ]);

  if (!validEducationLevels.includes(value)) {
    return "Please select a valid education qualification.";
  }

  return "";
};


export const validateGraduationYear = (year) => {
  const value = (year || "").trim();

  if (!value) {
    return "Passing / Graduation Year is required.";
  }

  if (year !== value) {
    return "Year cannot start or end with spaces.";
  }

  if (/\s/.test(value)) {
    return "Year cannot contain spaces.";
  }

  if (!/^\d+$/.test(value)) {
    return "Year must contain only numbers.";
  }

  if (value.length !== 4) {
    return "Year must be exactly 4 digits.";
  }

  const yearNumber = Number(value);
  const currentYear = new Date().getFullYear();

  if (yearNumber < 1950) {
    return "Please enter a valid year.";
  }

  if (yearNumber > currentYear) {
    return "Year cannot be in the future.";
  }

  return "";
};



export const validateExperienceLevel = (experience) => {
  const value = (experience || "").trim();

  if (!value) {
    return "Please select your experience level.";
  }

  const validExperienceLevels = Object.freeze([
    "FRESHER",
    "0-1",
    "1-3",
    "3-5",
    "5+",
  ]);

  if (!validExperienceLevels.includes(value)) {
    return "Please select a valid experience level.";
  }

  return "";
};


export const validateJobTitle = (jobTitle) => {
  const value = (jobTitle || "").trim();

  if (!value) {
    return "Job Title is required.";
  }

  if (jobTitle !== value) {
    return "Job Title cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Job Title cannot contain multiple consecutive spaces.";
  }

  if (value.length < 2) {
    return "Job Title must be at least 2 characters.";
  }

  if (value.length > 100) {
    return "Job Title cannot exceed 100 characters.";
  }

  // Must start with a letter
  if (!/^[A-Za-z]/.test(value)) {
    return "Job Title must start with a letter.";
  }

  // Allow only professional job title characters
  if (!/^[A-Za-z][A-Za-z0-9\s.'&()/#+-]*$/.test(value)) {
    return "Job Title contains invalid characters.";
  }

  // Reject repeated characters (aaaa, bbbb)
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid Job Title.";
  }

  // Must contain at least one letter
  if (!/[A-Za-z]/.test(value)) {
    return "Job Title must contain letters.";
  }

  return "";
};



export const validateSkill = (skill) => {
  const value = (skill || "").trim();

  if (!value) {
    return "Primary Skill is required.";
  }

  if (value.length < 2) {
    return "Primary Skill is too short.";
  }

  if (value.length > 100) {
    return "Primary Skill cannot exceed 100 characters.";
  }

  if (!/^[A-Za-z0-9\s.#&()+/-]+$/.test(value)) {
    return "Enter a valid Primary Skill.";
  }

  // Reject repeated single character
  if (/^(.)\1+$/.test(value.replace(/\s/g, "").toLowerCase())) {
    return "Enter a valid Primary Skill.";
  }

  // Must contain at least one letter
  if (!/[A-Za-z]/.test(value)) {
    return "Primary Skill must contain letters.";
  }

  return "";
};



export const validateSalary = (salary) => {
  const value = (salary || "").trim();

  // Optional field
  if (!value) {
    return "";
  }

  if (salary !== value) {
    return "Expected Annual CTC cannot start or end with spaces.";
  }

  if (/\s/.test(value)) {
    return "Expected Annual CTC cannot contain spaces.";
  }

  if (!/^\d+$/.test(value)) {
    return "Expected Annual CTC must contain only numbers.";
  }

  const salaryNumber = Number(value);

  if (salaryNumber < 10000) {
    return "Expected Annual CTC must be at least ₹10,000.";
  }

  if (salaryNumber > 100000000) {
    return "Expected Annual CTC cannot exceed ₹10,00,00,000.";
  }

  return "";
};



export const validateInstitution = (institution) => {
  const value = (institution || "").trim();

  if (!value) {
    return "Institution Name is required.";
  }

  if (institution !== value) {
    return "Institution Name cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Institution Name cannot contain multiple consecutive spaces.";
  }

  if (value.length < 3) {
    return "Institution Name must be at least 3 characters.";
  }

  if (value.length > 100) {
    return "Institution Name cannot exceed 100 characters.";
  }

  // Must start with a letter
  if (!/^[A-Za-z]/.test(value)) {
    return "Institution Name must start with a letter.";
  }

  // Allow common institution name characters
  if (!/^[A-Za-z][A-Za-z0-9\s.'&(),-]*$/.test(value)) {
    return "Institution Name contains invalid characters.";
  }

  // Reject repeated characters (aaaa, bbbb)
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid Institution Name.";
  }

  // Must contain at least one letter
  if (!/[A-Za-z]/.test(value)) {
    return "Institution Name must contain letters.";
  }

  return "";
};



export const validateQualification = (qualification) => {
  const value = (qualification || "").trim();

  if (!value) {
    return "Qualification is required.";
  }

  if (qualification !== value) {
    return "Qualification cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Qualification cannot contain multiple consecutive spaces.";
  }

  if (value.length < 2) {
    return "Qualification must be at least 2 characters.";
  }

  if (value.length > 100) {
    return "Qualification cannot exceed 100 characters.";
  }

  // Must start with a letter
  if (!/^[A-Za-z]/.test(value)) {
    return "Qualification must start with a letter.";
  }

  // Allow common qualification names
  if (!/^[A-Za-z][A-Za-z0-9\s.'&()/,+-]*$/.test(value)) {
    return "Qualification contains invalid characters.";
  }

  // Reject repeated characters
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid Qualification.";
  }

  // Must contain at least one letter
  if (!/[A-Za-z]/.test(value)) {
    return "Qualification must contain letters.";
  }

  return "";
};


export const validateCompany = (company) => {
  const value = (company || "").trim();

  if (!value) {
    return "Current Company is required.";
  }

  if (company !== value) {
    return "Current Company cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Current Company cannot contain multiple consecutive spaces.";
  }

  if (value.length < 2) {
    return "Current Company must be at least 2 characters.";
  }

  if (value.length > 100) {
    return "Current Company cannot exceed 100 characters.";
  }

  // Must start with a letter
  if (!/^[A-Za-z]/.test(value)) {
    return "Current Company must start with a letter.";
  }

  // Allow common company name characters
  if (!/^[A-Za-z][A-Za-z0-9\s.'&(),/-]*$/.test(value)) {
    return "Current Company contains invalid characters.";
  }

  // Reject repeated characters (aaaa, bbbb)
  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid Current Company.";
  }

  // Must contain at least one letter
  if (!/[A-Za-z]/.test(value)) {
    return "Current Company must contain letters.";
  }

  return "";
};




export const validateResume = (file) => {
  if (!file) {
    return "Resume is required.";
  }

  if (file.type !== "application/pdf") {
    return "Only PDF files are allowed.";
  }

  if (file.size === 0) {
    return "Selected resume is invalid.";
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return "Resume must not exceed 5 MB.";
  }

  return "";
};



export const validateEmploymentType = (
  employmentType
) => {
  const value = (employmentType || "").trim();

  if (!value) {
    return "Employment Type is required.";
  }

  const validEmploymentTypes = [
    "FULL_TIME",
    "PART_TIME",
    "INTERNSHIP",
    "CONTRACT",
  ];

  if (!validEmploymentTypes.includes(value)) {
    return "Please select a valid Employment Type.";
  }

  return "";
};



export const validateWorkMode = (
  workMode
) => {
  const value = (workMode || "").trim();

  if (!value) {
    return "Preferred Work Mode is required.";
  }

  const validWorkModes = [
    "ONSITE",
    "HYBRID",
    "REMOTE",
  ];

  if (!validWorkModes.includes(value)) {
    return "Please select a valid Preferred Work Mode.";
  }

  return "";
};



export const validateCompanyName = (companyName) => {
  const value = (companyName || "").trim();

  if (!value) {
    return "Company Name is required.";
  }

  if (companyName !== value) {
    return "Company Name cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Company Name cannot contain multiple consecutive spaces.";
  }

  if (value.length < 2) {
    return "Company Name must be at least 2 characters.";
  }

  if (value.length > 100) {
    return "Company Name cannot exceed 100 characters.";
  }

  if (!/^[A-Za-z]/.test(value)) {
    return "Company Name must start with a letter.";
  }

  if (!/^[A-Za-z][A-Za-z0-9\s.'&(),/-]*$/.test(value)) {
    return "Company Name contains invalid characters.";
  }

  if (/^(.)\1+$/i.test(value.replace(/\s/g, ""))) {
    return "Please enter a valid Company Name.";
  }

  return "";
};


export const validateContactPerson = (contactPerson) => {
  return validateName(
    contactPerson,
    "Contact Person"
  );
};


export const validateContactPhone = (phone) => {
  return validatePhone(phone);
};


export const validateWebsite = (website) => {
  const value = (website || "").trim();

  if (!value) {
    return "";
  }

  if (website !== value) {
    return "Website cannot start or end with spaces.";
  }

  try {
    new URL(value);
  } catch {
    return "Please enter a valid website URL.";
  }

  return "";
};


export const validateDescription = (description) => {
  const value = (description || "").trim();

  if (!value) {
    return "Company Description is required.";
  }

  if (description !== value) {
    return "Company Description cannot start or end with spaces.";
  }

  if (/\s{2,}/.test(value)) {
    return "Company Description cannot contain multiple consecutive spaces.";
  }

  if (value.length < 20) {
    return "Company Description must be at least 20 characters.";
  }

  if (value.length > 1000) {
    return "Company Description cannot exceed 1000 characters.";
  }

  if (!/[A-Za-z]/.test(value)) {
    return "Company Description must contain meaningful text.";
  }

  return "";
};