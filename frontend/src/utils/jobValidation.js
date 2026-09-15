// ==========================================
// JOB FORM VALIDATION
// ==========================================

// ------------------------------------------
// Common helper
// ------------------------------------------

const hasLeadingOrTrailingSpaces = (original, trimmed) => {
  return original !== trimmed;
};


// ==========================================
// JOB TITLE
// ==========================================

export const validateJobTitle = (title) => {
  const value = (title || "").trim();

  if (!value) {
    return "Job title is required.";
  }

  if (hasLeadingOrTrailingSpaces(title, value)) {
    return "Job title cannot start or end with spaces.";
  }

  if (value.length < 2) {
    return "Job title must be at least 2 characters.";
  }

  if (value.length > 255) {
    return "Job title cannot exceed 255 characters.";
  }

  // Must contain at least one letter.
  if (!/[A-Za-z]/.test(value)) {
    return "Job title must contain at least one letter.";
  }

  // Prevent symbols-only / unwanted special characters.
  if (!/^[A-Za-z0-9\s&+().,'/-]+$/.test(value)) {
    return "Job title contains invalid characters.";
  }

  return "";
};


// ==========================================
// JOB DESCRIPTION
// ==========================================

export const validateJobDescription = (description) => {
  const value = (description || "").trim();

  if (!value) {
    return "Job description is required.";
  }

  if (hasLeadingOrTrailingSpaces(description, value)) {
    return "Job description cannot start or end with spaces.";
  }

  if (value.length < 20) {
    return "Job description must be at least 20 characters.";
  }

  // Must contain at least one letter.
  if (!/[A-Za-z]/.test(value)) {
    return "Job description must contain at least one letter.";
  }

  return "";
};


// ==========================================
// JOB LOCATION
// ==========================================

export const validateJobLocation = (location) => {
  const value = (location || "").trim();

  if (!value) {
    return "Job location is required.";
  }

  if (hasLeadingOrTrailingSpaces(location, value)) {
    return "Job location cannot start or end with spaces.";
  }

  if (value.length < 2) {
    return "Job location must be at least 2 characters.";
  }

  if (value.length > 255) {
    return "Job location cannot exceed 255 characters.";
  }

  // Examples:
  // Kochi
  // Bengaluru, India
  // New Delhi - India
  // 560001
  if (!/[A-Za-z]/.test(value)) {
    return "Job location must contain at least one letter.";
  }

  if (!/^[A-Za-z0-9\s,.'/-]+$/.test(value)) {
    return "Job location contains invalid characters.";
  }

  return "";
};


// ==========================================
// WORK MODE
// ==========================================

export const validateJobWorkMode = (workMode) => {
  const value = (workMode || "").trim();

  if (!value) {
    return "Work mode is required.";
  }

  const validWorkModes = [
    "ONSITE",
    "REMOTE",
    "HYBRID",
  ];

  if (!validWorkModes.includes(value)) {
    return "Please select a valid work mode.";
  }

  return "";
};


// ==========================================
// EMPLOYMENT TYPE
// ==========================================

export const validateJobEmploymentType = (
  employmentType
) => {
  const value = (employmentType || "").trim();

  if (!value) {
    return "Employment type is required.";
  }

  const validEmploymentTypes = [
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "FREELANCE",
  ];

  if (!validEmploymentTypes.includes(value)) {
    return "Please select a valid employment type.";
  }

  return "";
};


// ==========================================
// SKILLS
// ==========================================

export const validateJobSkills = (skills) => {
  const value = (skills || "").trim();

  if (!value) {
    return "Skills are required.";
  }

  if (hasLeadingOrTrailingSpaces(skills, value)) {
    return "Skills cannot start or end with spaces.";
  }

  if (value.length < 2) {
    return "Skills must contain at least 2 characters.";
  }

  if (value.length > 1000) {
    return "Skills cannot exceed 1000 characters.";
  }

  if (!/[A-Za-z]/.test(value)) {
    return "Skills must contain at least one letter.";
  }

  // Allows:
  // React, JavaScript, Node.js, C++, C#, .NET
  if (!/^[A-Za-z0-9\s,.'+#/-]+$/.test(value)) {
    return "Skills contain invalid characters.";
  }

  return "";
};


// ==========================================
// EXPERIENCE
// ==========================================

export const validateJobExperience = (experience) => {
  const value = (experience || "").trim();

  if (!value) {
    return "Experience requirement is required.";
  }

  if (hasLeadingOrTrailingSpaces(experience, value)) {
    return "Experience requirement cannot start or end with spaces.";
  }

  if (value.length < 2) {
    return "Experience requirement must be at least 2 characters.";
  }

  if (value.length > 100) {
    return "Experience requirement cannot exceed 100 characters.";
  }

  // Examples:
  // 2 years
  // 3-5 years
  // Fresher
  // 5+ years
  if (!/[A-Za-z0-9]/.test(value)) {
    return "Experience requirement contains invalid characters.";
  }

  if (!/^[A-Za-z0-9\s.+-]+$/.test(value)) {
    return "Experience requirement contains invalid characters.";
  }

  return "";
};


// ==========================================
// EDUCATION
// ==========================================

export const validateJobEducation = (education) => {
  const value = (education || "").trim();

  if (!value) {
    return "Education is required.";
  }

  if (hasLeadingOrTrailingSpaces(education, value)) {
    return "Education cannot start or end with spaces.";
  }

  if (value.length < 2) {
    return "Education must be at least 2 characters.";
  }

  if (value.length > 255) {
    return "Education cannot exceed 255 characters.";
  }

  if (!/[A-Za-z]/.test(value)) {
    return "Education must contain at least one letter.";
  }

  if (!/^[A-Za-z0-9\s.,&()+/-]+$/.test(value)) {
    return "Education contains invalid characters.";
  }

  return "";
};


// ==========================================
// POSITION
// ==========================================

export const validateJobPosition = (position) => {
  const value = (position || "").trim();

  if (!value) {
    return "Position is required.";
  }

  if (hasLeadingOrTrailingSpaces(position, value)) {
    return "Position cannot start or end with spaces.";
  }

  if (value.length < 2) {
    return "Position must be at least 2 characters.";
  }

  if (value.length > 255) {
    return "Position cannot exceed 255 characters.";
  }

  if (!/[A-Za-z]/.test(value)) {
    return "Position must contain at least one letter.";
  }

  if (!/^[A-Za-z0-9\s&+().,'/-]+$/.test(value)) {
    return "Position contains invalid characters.";
  }

  return "";
};


// ==========================================
// SALARY VALIDATION
// ==========================================

export const validateJobSalary = (
  salary,
  fieldName = "Salary"
) => {
  const value = String(salary ?? "").trim();

  // Salary is optional.
  if (!value) {
    return "";
  }

  if (String(salary) !== value) {
    return `${fieldName} cannot contain spaces.`;
  }

  // Numbers only.
  if (!/^\d+$/.test(value)) {
    return `${fieldName} must contain only numbers.`;
  }

  const salaryNumber = Number(value);

  if (!Number.isSafeInteger(salaryNumber)) {
    return `${fieldName} is too large.`;
  }

  if (salaryNumber < 0) {
    return `${fieldName} cannot be negative.`;
  }

  return "";
};


// ==========================================
// APPLICATION DEADLINE
// ==========================================

export const validateApplicationDeadline = (
  deadline
) => {
  const value = (deadline || "").trim();

  // Deadline is optional.
  if (!value) {
    return "";
  }

  // Expected format: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Please enter a valid application deadline.";
  }

  const selectedDate = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(selectedDate.getTime())) {
    return "Please enter a valid application deadline.";
  }

  // Check that the date actually exists.
  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (
    selectedDate.getFullYear() !== year ||
    selectedDate.getMonth() !== month - 1 ||
    selectedDate.getDate() !== day
  ) {
    return "Please enter a valid application deadline.";
  }

  // ========================================
  // PAST DATE VALIDATION
  // ========================================

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "Application deadline cannot be in the past.";
  }

  return "";
};


// ==========================================
// COMPLETE JOB FORM VALIDATION
// ==========================================

export const validateJobForm = (formData) => {
  const errors = {};

  // ----------------------------------------
  // Basic Information
  // ----------------------------------------

  const titleError = validateJobTitle(
    formData.title
  );

  if (titleError) {
    errors.title = titleError;
  }


  const descriptionError =
    validateJobDescription(
      formData.description
    );

  if (descriptionError) {
    errors.description = descriptionError;
  }


  // ----------------------------------------
  // Job Details
  // ----------------------------------------

  const locationError =
    validateJobLocation(
      formData.location
    );

  if (locationError) {
    errors.location = locationError;
  }


  const workModeError =
    validateJobWorkMode(
      formData.work_mode
    );

  if (workModeError) {
    errors.work_mode = workModeError;
  }


  const employmentTypeError =
    validateJobEmploymentType(
      formData.employment_type
    );

  if (employmentTypeError) {
    errors.employment_type =
      employmentTypeError;
  }


  const positionError =
    validateJobPosition(
      formData.position
    );

  if (positionError) {
    errors.position = positionError;
  }


  const experienceError =
    validateJobExperience(
      formData.experience_required
    );

  if (experienceError) {
    errors.experience_required =
      experienceError;
  }


  const educationError =
    validateJobEducation(
      formData.education
    );

  if (educationError) {
    errors.education = educationError;
  }


  const skillsError =
    validateJobSkills(
      formData.skills
    );

  if (skillsError) {
    errors.skills = skillsError;
  }


  // ----------------------------------------
  // Salary
  // ----------------------------------------

  const minimumSalaryError =
    validateJobSalary(
      formData.minimum_salary,
      "Minimum salary"
    );

  if (minimumSalaryError) {
    errors.minimum_salary =
      minimumSalaryError;
  }


  const maximumSalaryError =
    validateJobSalary(
      formData.maximum_salary,
      "Maximum salary"
    );

  if (maximumSalaryError) {
    errors.maximum_salary =
      maximumSalaryError;
  }


  // Minimum salary cannot exceed maximum.
  const minimumSalary = String(
    formData.minimum_salary ?? ""
  ).trim();

  const maximumSalary = String(
    formData.maximum_salary ?? ""
  ).trim();

  if (
    minimumSalary &&
    maximumSalary &&
    /^\d+$/.test(minimumSalary) &&
    /^\d+$/.test(maximumSalary)
  ) {
    if (
      Number(minimumSalary) >
      Number(maximumSalary)
    ) {
      errors.maximum_salary =
        "Maximum salary must be greater than or equal to minimum salary.";
    }
  }


  // ----------------------------------------
  // Application Deadline
  // ----------------------------------------

  const deadlineError =
    validateApplicationDeadline(
      formData.application_deadline
    );

  if (deadlineError) {
    errors.application_deadline =
      deadlineError;
  }


  return errors;
};