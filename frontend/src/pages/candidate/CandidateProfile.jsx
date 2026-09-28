import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  Loader2,
  MapPin,
  AlertCircle,
  Camera,
} from "lucide-react";

import CandidateDashboardLayout from "../../components/candidate/dashboard/CandidateDashboardLayout";

import PersonalInfoSection from "../../components/candidate/profile/PersonalInfoSection";
import ProfessionalInfoSection from "../../components/candidate/profile/ProfessionalInfoSection";
import SocialLinksSection from "../../components/candidate/profile/SocialLinksSection";
import SkillsSection from "../../components/candidate/profile/SkillsSection";
import ExperienceSection from "../../components/candidate/profile/ExperienceSection";
import EducationSection from "../../components/candidate/profile/EducationSection";
import EducationModal from "../../components/candidate/profile/EducationModal";
import ExperienceModal from "../../components/candidate/profile/ExperienceModal";
import ProfileSection from "../../components/candidate/profile/ProfileSection";
import FormField from "../../components/candidate/profile/FormField";

import {
  getCandidateProfile,
  updateCandidateProfile,
} from "../../services/candidate/candidateProfileService";

import {
  createSkill,
  getSkills,
  deleteSkill,
} from "../../services/candidate/candidateSkillService";

import {
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
} from "../../services/candidate/candidateEducationService";

import {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
} from "../../services/candidate/candidateExperienceService";

import {
  validateName,
  validatePhone,
  validateDateOfBirth,
  validateAbout,
  validateHeadline,
  validateLocation,
  validateLinkedIn,
  validateGitHub,
  validatePortfolio,
} from "../../utils/validation";

function CandidateProfile({ embedded = false }) {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Profile Picture
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] =
    useState("");

  // Skills
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillName, setSkillName] = useState("");
  const [skillProficiency, setSkillProficiency] = useState("");
  const [skillYears, setSkillYears] = useState("");
  const [skillError, setSkillError] = useState("");
  const [skillSaving, setSkillSaving] = useState(false);

  // Education
  const [educations, setEducations] = useState([]);
  const [educationLoading, setEducationLoading] = useState(true);
  const [educationSaving, setEducationSaving] = useState(false);
  const [educationError, setEducationError] = useState("");
  const [showEducationForm, setShowEducationForm] =
    useState(false);
  const [editingEducationId, setEditingEducationId] =
    useState(null);

  const [educationForm, setEducationForm] = useState({
    education_level: "",
    institution_name: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    score: "",
    description: "",
  });

  const [educationFormErrors, setEducationFormErrors] =
    useState({});

  // Experience
  const [experiences, setExperiences] = useState([]);
  const [experienceLoading, setExperienceLoading] =
    useState(true);
  const [experienceSaving, setExperienceSaving] =
    useState(false);
  const [experienceError, setExperienceError] = useState("");
  const [showExperienceForm, setShowExperienceForm] =
    useState(false);
  const [editingExperienceId, setEditingExperienceId] =
    useState(null);

  const [experienceForm, setExperienceForm] = useState({
    company_name: "",
    job_title: "",
    employment_type: "",
    location: "",
    start_date: "",
    end_date: "",
    currently_working: false,
    description: "",
  });

  const [experienceFormErrors, setExperienceFormErrors] =
    useState({});

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setServerError("");

    try {
      const data = await getCandidateProfile();

      setProfile(data);

      setProfilePicturePreview(
        data?.profile_picture || ""
      );

      setFormData({
        first_name: data?.first_name || "",
        last_name: data?.last_name || "",
        phone_number: data?.phone_number || "",
        date_of_birth: data?.date_of_birth || "",
        gender: data?.gender || "",
        location: data?.location || "",
        headline: data?.headline || "",
        about: data?.about || "",
        linkedin_url: data?.linkedin_url || "",
        github_url: data?.github_url || "",
        portfolio_url: data?.portfolio_url || "",
      });
    } catch (error) {
      setServerError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH SKILLS / EDUCATION / EXPERIENCE
  // ==========================================

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    fetchEducations();
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchSkills = async () => {
    setSkillsLoading(true);
    setSkillError("");

    try {
      const data = await getSkills();

      setSkills(
        Array.isArray(data)
          ? data
          : data?.skills || []
      );
    } catch (error) {
      setSkillError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to load your skills."
      );
    } finally {
      setSkillsLoading(false);
    }
  };

  const fetchEducations = async () => {
    setEducationLoading(true);
    setEducationError("");

    try {
      const data = await getEducations();

      setEducations(
        Array.isArray(data)
          ? data
          : data?.educations || []
      );
    } catch (error) {
      setEducationError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to load your education."
      );
    } finally {
      setEducationLoading(false);
    }
  };

  // ==========================================
  // EDUCATION FORM CHANGE
  // ==========================================

  const handleEducationChange = (event) => {
    const { name, value } = event.target;

    setEducationForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setEducationFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setEducationError("");
  };

  // ==========================================
  // RESET EDUCATION FORM
  // ==========================================

  const resetEducationForm = () => {
    setEducationForm({
      education_level: "",
      institution_name: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      score: "",
      description: "",
    });

    setEducationFormErrors({});
    setEducationError("");
    setEditingEducationId(null);
    setShowEducationForm(false);
  };

  // ==========================================
  // VALIDATE EDUCATION
  // ==========================================

  const validateEducationForm = () => {
    const newErrors = {};

    const institutionName =
      educationForm.institution_name.trim();

    const fieldOfStudy =
      educationForm.field_of_study.trim();

    const score =
      educationForm.score.trim();

    const description =
      educationForm.description.trim();

    if (!educationForm.education_level) {
      newErrors.education_level =
        "Education level is required.";
    }

    if (!institutionName) {
      newErrors.institution_name =
        "Institution name is required.";
    } else if (institutionName.length < 2) {
      newErrors.institution_name =
        "Institution name must be at least 2 characters.";
    } else if (institutionName.length > 255) {
      newErrors.institution_name =
        "Institution name cannot exceed 255 characters.";
    }

    if (fieldOfStudy.length > 255) {
      newErrors.field_of_study =
        "Field of study cannot exceed 255 characters.";
    }

    if (
      educationForm.start_date &&
      educationForm.end_date &&
      educationForm.end_date <
        educationForm.start_date
    ) {
      newErrors.end_date =
        "End date cannot be before start date.";
    }

    if (score.length > 50) {
      newErrors.score =
        "Score cannot exceed 50 characters.";
    }

    if (description.length > 5000) {
      newErrors.description =
        "Description cannot exceed 5000 characters.";
    }

    setEducationFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // OPEN ADD EDUCATION
  // ==========================================

  const handleAddEducationClick = () => {
    setEducationForm({
      education_level: "",
      institution_name: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      score: "",
      description: "",
    });

    setEducationFormErrors({});
    setEducationError("");
    setEditingEducationId(null);
    setShowEducationForm(true);
  };

  // ==========================================
  // OPEN EDIT EDUCATION
  // ==========================================

  const handleEditEducation = (education) => {
    setEducationForm({
      education_level:
        education?.education_level || "",
      institution_name:
        education?.institution_name || "",
      field_of_study:
        education?.field_of_study || "",
      start_date:
        education?.start_date || "",
      end_date:
        education?.end_date || "",
      score:
        education?.score || "",
      description:
        education?.description || "",
    });

    setEducationFormErrors({});
    setEducationError("");
    setEditingEducationId(education.id);
    setShowEducationForm(true);
  };

  // ==========================================
  // SAVE EDUCATION
  // ==========================================

  const handleSaveEducation = async () => {
    setEducationError("");

    if (!validateEducationForm()) {
      return;
    }

    setEducationSaving(true);

    const payload = {
      education_level:
        educationForm.education_level,
      institution_name:
        educationForm.institution_name.trim(),
      field_of_study:
        educationForm.field_of_study.trim(),
      start_date:
        educationForm.start_date || null,
      end_date:
        educationForm.end_date || null,
      score:
        educationForm.score.trim(),
      description:
        educationForm.description.trim(),
    };

    try {
      if (editingEducationId) {
        const updatedEducation =
          await updateEducation(
            editingEducationId,
            payload
          );

        setEducations((previous) =>
          previous.map((education) =>
            education.id === editingEducationId
              ? updatedEducation
              : education
          )
        );
      } else {
        const newEducation =
          await createEducation(payload);

        setEducations((previous) => [
          ...previous,
          newEducation,
        ]);
      }

      resetEducationForm();
    } catch (error) {
      const responseData =
        error.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const backendErrors = {};

        Object.entries(responseData).forEach(
          ([field, messages]) => {
            if (Array.isArray(messages)) {
              backendErrors[field] =
                messages[0];
            } else if (
              typeof messages === "string"
            ) {
              backendErrors[field] =
                messages;
            }
          }
        );

        if (
          Object.keys(backendErrors).length > 0
        ) {
          setEducationFormErrors(
            backendErrors
          );
        } else {
          setEducationError(
            responseData?.detail ||
              responseData?.message ||
              "Unable to save education."
          );
        }
      } else {
        setEducationError(
          "Unable to save education. Please try again."
        );
      }
    } finally {
      setEducationSaving(false);
    }
  };

  // ==========================================
  // DELETE EDUCATION
  // ==========================================

  const handleDeleteEducation = async (
    educationId
  ) => {
    setEducationError("");

    try {
      await deleteEducation(educationId);

      setEducations((previous) =>
        previous.filter(
          (education) =>
            education.id !== educationId
        )
      );
    } catch (error) {
      setEducationError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to remove education."
      );
    }
  };

  // ==========================================
  // FETCH EXPERIENCE
  // ==========================================

  const fetchExperiences = async () => {
    setExperienceLoading(true);
    setExperienceError("");

    try {
      const data = await getExperiences();

      setExperiences(
        Array.isArray(data)
          ? data
          : data?.experiences || []
      );
    } catch (error) {
      setExperienceError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to load your experience."
      );
    } finally {
      setExperienceLoading(false);
    }
  };

  // ==========================================
  // EXPERIENCE FORM CHANGE
  // ==========================================

  const handleExperienceChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setExperienceForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : value,
    }));

    setExperienceFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setExperienceError("");
  };

  // ==========================================
  // RESET EXPERIENCE FORM
  // ==========================================

  const resetExperienceForm = () => {
    setExperienceForm({
      company_name: "",
      job_title: "",
      employment_type: "",
      location: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      description: "",
    });

    setExperienceFormErrors({});
    setExperienceError("");
    setEditingExperienceId(null);
    setShowExperienceForm(false);
  };

  // ==========================================
  // VALIDATE EXPERIENCE
  // ==========================================

  const validateExperienceForm = () => {
    const newErrors = {};

    const companyName =
      experienceForm.company_name.trim();

    const jobTitle =
      experienceForm.job_title.trim();

    const employmentType =
      experienceForm.employment_type.trim();

    const location =
      experienceForm.location.trim();

    const description =
      experienceForm.description.trim();

    if (!companyName) {
      newErrors.company_name =
        "Company name is required.";
    } else if (companyName.length > 255) {
      newErrors.company_name =
        "Company name cannot exceed 255 characters.";
    }

    if (!jobTitle) {
      newErrors.job_title =
        "Job title is required.";
    } else if (jobTitle.length > 255) {
      newErrors.job_title =
        "Job title cannot exceed 255 characters.";
    }

    if (employmentType.length > 50) {
      newErrors.employment_type =
        "Employment type cannot exceed 50 characters.";
    }

    if (location.length > 255) {
      newErrors.location =
        "Location cannot exceed 255 characters.";
    }

    if (!experienceForm.start_date) {
      newErrors.start_date =
        "Start date is required.";
    }

    if (
      !experienceForm.currently_working &&
      !experienceForm.end_date
    ) {
      newErrors.end_date =
        "End date is required unless you are currently working.";
    }

    if (
      experienceForm.start_date &&
      experienceForm.end_date &&
      experienceForm.end_date <
        experienceForm.start_date
    ) {
      newErrors.end_date =
        "End date cannot be before start date.";
    }

    if (description.length > 5000) {
      newErrors.description =
        "Description cannot exceed 5000 characters.";
    }

    setExperienceFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // OPEN ADD EXPERIENCE
  // ==========================================

  const handleAddExperienceClick = () => {
    setExperienceForm({
      company_name: "",
      job_title: "",
      employment_type: "",
      location: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      description: "",
    });

    setExperienceFormErrors({});
    setExperienceError("");
    setEditingExperienceId(null);
    setShowExperienceForm(true);
  };

  // ==========================================
  // OPEN EDIT EXPERIENCE
  // ==========================================

  const handleEditExperience = (experience) => {
    setExperienceForm({
      company_name:
        experience?.company_name || "",
      job_title:
        experience?.job_title || "",
      employment_type:
        experience?.employment_type || "",
      location:
        experience?.location || "",
      start_date:
        experience?.start_date || "",
      end_date:
        experience?.end_date || "",
      currently_working:
        Boolean(experience?.currently_working),
      description:
        experience?.description || "",
    });

    setExperienceFormErrors({});
    setExperienceError("");
    setEditingExperienceId(experience.id);
    setShowExperienceForm(true);
  };

  // ==========================================
  // SAVE EXPERIENCE
  // ==========================================

  const handleSaveExperience = async () => {
    setExperienceError("");

    if (!validateExperienceForm()) {
      return;
    }

    setExperienceSaving(true);

    const payload = {
      company_name:
        experienceForm.company_name.trim(),
      job_title:
        experienceForm.job_title.trim(),
      employment_type:
        experienceForm.employment_type.trim(),
      location:
        experienceForm.location.trim(),
      start_date:
        experienceForm.start_date,
      end_date:
        experienceForm.currently_working
          ? null
          : experienceForm.end_date || null,
      currently_working:
        experienceForm.currently_working,
      description:
        experienceForm.description.trim(),
    };

    try {
      if (editingExperienceId) {
        const updatedExperience =
          await updateExperience(
            editingExperienceId,
            payload
          );

        setExperiences((previous) =>
          previous.map((experience) =>
            experience.id === editingExperienceId
              ? updatedExperience
              : experience
          )
        );
      } else {
        const newExperience =
          await createExperience(payload);

        setExperiences((previous) => [
          ...previous,
          newExperience,
        ]);
      }

      resetExperienceForm();
    } catch (error) {
      const responseData =
        error.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const backendErrors = {};

        Object.entries(responseData).forEach(
          ([field, messages]) => {
            if (Array.isArray(messages)) {
              backendErrors[field] =
                messages[0];
            } else if (
              typeof messages === "string"
            ) {
              backendErrors[field] =
                messages;
            }
          }
        );

        if (
          Object.keys(backendErrors).length > 0
        ) {
          setExperienceFormErrors(
            backendErrors
          );
        } else {
          setExperienceError(
            responseData?.detail ||
              responseData?.message ||
              "Unable to save experience."
          );
        }
      } else {
        setExperienceError(
          "Unable to save experience. Please try again."
        );
      }
    } finally {
      setExperienceSaving(false);
    }
  };

  // ==========================================
  // DELETE EXPERIENCE
  // ==========================================

  const handleDeleteExperience = async (
    experienceId
  ) => {
    setExperienceError("");

    try {
      await deleteExperience(experienceId);

      setExperiences((previous) =>
        previous.filter(
          (experience) =>
            experience.id !== experienceId
        )
      );
    } catch (error) {
      setExperienceError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to remove experience."
      );
    }
  };

  // ==========================================
  // PROFILE PICTURE CHANGE
  // ==========================================

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setServerError(
        "Profile picture must be JPG, JPEG, PNG, or WEBP."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setServerError(
        "Profile picture cannot exceed 5 MB."
      );
      event.target.value = "";
      return;
    }

    setServerError("");
    setSuccessMessage("");

    setProfilePicture(file);

    setProfilePicturePreview(
      URL.createObjectURL(file)
    );
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSuccessMessage("");
    setServerError("");
  };

  // ==========================================
  // VALIDATE PROFILE
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    const firstNameError = validateName(
      formData.first_name,
      "First Name"
    );

    if (firstNameError) {
      newErrors.first_name = firstNameError;
    }

    const lastNameError = validateName(
      formData.last_name,
      "Last Name"
    );

    if (lastNameError) {
      newErrors.last_name = lastNameError;
    }

    const phoneError = validatePhone(
      formData.phone_number
    );

    if (phoneError) {
      newErrors.phone_number = phoneError;
    }

    const dateOfBirthError =
      validateDateOfBirth(
        formData.date_of_birth
      );

    if (dateOfBirthError) {
      newErrors.date_of_birth =
        dateOfBirthError;
    }

    const locationError = validateLocation(
      formData.location
    );

    if (locationError) {
      newErrors.location = locationError;
    }

    const headlineError = validateHeadline(
      formData.headline
    );

    if (headlineError) {
      newErrors.headline = headlineError;
    }

    const aboutError = validateAbout(
      formData.about
    );

    if (aboutError) {
      newErrors.about = aboutError;
    }

    const linkedinError = validateLinkedIn(
      formData.linkedin_url
    );

    if (linkedinError) {
      newErrors.linkedin_url =
        linkedinError;
    }

    const githubError = validateGitHub(
      formData.github_url
    );

    if (githubError) {
      newErrors.github_url =
        githubError;
    }

    const portfolioError =
      validatePortfolio(
        formData.portfolio_url
      );

    if (portfolioError) {
      newErrors.portfolio_url =
        portfolioError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {
    setEditing(true);
    setErrors({});
    setSuccessMessage("");
    setServerError("");
    setSkillError("");
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone_number: profile?.phone_number || "",
      date_of_birth:
        profile?.date_of_birth || "",
      gender: profile?.gender || "",
      location: profile?.location || "",
      headline: profile?.headline || "",
      about: profile?.about || "",
      linkedin_url:
        profile?.linkedin_url || "",
      github_url:
        profile?.github_url || "",
      portfolio_url:
        profile?.portfolio_url || "",
    });

    setProfilePicture(null);
    setProfilePicturePreview(
      profile?.profile_picture || ""
    );

    setErrors({});
    setServerError("");
    setSuccessMessage("");
    setSkillError("");

    setSkillName("");
    setSkillProficiency("");
    setSkillYears("");

    resetEducationForm();
    setEducationError("");

    resetExperienceForm();
    setExperienceError("");

    setEditing(false);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {
    setSuccessMessage("");
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(
        ([key, value]) => {
          data.append(key, value ?? "");
        }
      );

      if (profilePicture) {
        data.append(
          "profile_picture",
          profilePicture
        );
      }

      const updatedProfile =
        await updateCandidateProfile(data);

      setProfile(updatedProfile);

      setProfilePicture(null);

      setProfilePicturePreview(
        updatedProfile?.profile_picture || ""
      );

      setFormData({
        first_name:
          updatedProfile?.first_name || "",
        last_name:
          updatedProfile?.last_name || "",
        phone_number:
          updatedProfile?.phone_number || "",
        date_of_birth:
          updatedProfile?.date_of_birth || "",
        gender:
          updatedProfile?.gender || "",
        location:
          updatedProfile?.location || "",
        headline:
          updatedProfile?.headline || "",
        about:
          updatedProfile?.about || "",
        linkedin_url:
          updatedProfile?.linkedin_url || "",
        github_url:
          updatedProfile?.github_url || "",
        portfolio_url:
          updatedProfile?.portfolio_url || "",
      });

      setEditing(false);

      setSuccessMessage(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      const responseData =
        error.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const backendErrors = {};

        Object.entries(responseData).forEach(
          ([field, messages]) => {
            if (Array.isArray(messages)) {
              backendErrors[field] =
                messages[0];
            } else if (
              typeof messages === "string"
            ) {
              backendErrors[field] =
                messages;
            }
          }
        );

        if (
          Object.keys(backendErrors).length > 0
        ) {
          setErrors(backendErrors);
        } else {
          setServerError(
            responseData?.detail ||
              responseData?.message ||
              "Unable to update your profile."
          );
        }
      } else {
        setServerError(
          "Unable to update your profile. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ADD SKILL
  // ==========================================

  const handleAddSkill = async () => {
    const name = skillName.trim();

    setSkillError("");

    if (!name) {
      setSkillError(
        "Skill name is required."
      );
      return;
    }

    if (name.length < 2) {
      setSkillError(
        "Skill name must be at least 2 characters."
      );
      return;
    }

    if (name.length > 100) {
      setSkillError(
        "Skill name cannot exceed 100 characters."
      );
      return;
    }

    if (
      !/^[A-Za-z0-9+#.\- ]+$/.test(name)
    ) {
      setSkillError(
        "Skill name contains invalid characters."
      );
      return;
    }

    if (!skillProficiency) {
      setSkillError(
        "Please select proficiency level."
      );
      return;
    }

    if (
      skillYears === "" ||
      !/^\d+$/.test(
        String(skillYears)
      ) ||
      Number(skillYears) < 0 ||
      Number(skillYears) > 50
    ) {
      setSkillError(
        "Years of experience must be a whole number between 0 and 50."
      );
      return;
    }

    const alreadyExists = skills.some(
      (skill) =>
        (
          skill.skill_name ||
          skill.skill?.name ||
          ""
        )
          .trim()
          .toLowerCase() ===
        name.toLowerCase()
    );

    if (alreadyExists) {
      setSkillError(
        "This skill has already been added."
      );
      return;
    }

    setSkillSaving(true);

    try {
      const data = await createSkill({
        skill_name: name,
        proficiency: skillProficiency,
        years_of_experience:
          Number(skillYears),
      });

      setSkills((previous) => [
        ...previous,
        data,
      ]);

      setSkillName("");
      setSkillProficiency("");
      setSkillYears("");
    } catch (error) {
      const responseData =
        error.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const message =
          Object.values(responseData)
            .flat()
            .find(
              (item) =>
                typeof item === "string"
            );

        setSkillError(
          message ||
            "Unable to add skill."
        );
      } else {
        setSkillError(
          "Unable to add skill."
        );
      }
    } finally {
      setSkillSaving(false);
    }
  };

  // ==========================================
  // DELETE SKILL
  // ==========================================

  const handleDeleteSkill = async (
    skillId
  ) => {
    setSkillError("");

    try {
      await deleteSkill(skillId);

      setSkills((previous) =>
        previous.filter(
          (skill) =>
            skill.id !== skillId
        )
      );
    } catch (error) {
      setSkillError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to remove skill."
      );
    }
  };

  // ==========================================
  // PROFILE INITIAL
  // ==========================================

  const getInitial = () => {
    return (
      profile?.first_name
        ?.charAt(0)
        ?.toUpperCase() || "C"
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    if (embedded) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2
            size={32}
            className="animate-spin text-primary"
          />
        </div>
      );
    }

    return (
      <CandidateDashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader2
            size={32}
            className="animate-spin text-primary"
          />
        </div>
      </CandidateDashboardLayout>
    );
  }

  // ==========================================
  // PROFILE ERROR
  // ==========================================

  if (!profile) {
    if (embedded) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <AlertCircle
            size={28}
            className="mx-auto text-red-600"
          />

          <h2 className="mt-3 text-lg font-semibold text-red-700">
            Profile unavailable
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {serverError ||
              "Your candidate profile could not be loaded."}
          </p>
        </div>
      );
    }

    return (
      <CandidateDashboardLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <AlertCircle
            size={28}
            className="mx-auto text-red-600"
          />

          <h2 className="mt-3 text-lg font-semibold text-red-700">
            Profile unavailable
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {serverError ||
              "Your candidate profile could not be loaded."}
          </p>
        </div>
      </CandidateDashboardLayout>
    );
  }

  const profileContent = (
    <>
      <div className="space-y-5">

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "/candidate/dashboard")
              }
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-text">
              My Profile
            </h1>

            <p className="mt-1.5 text-base text-text-secondary">
              View and manage your professional profile information.
            </p>
          </div>

          {!editing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <Check
              size={18}
              className="shrink-0 text-emerald-600"
            />

            <p className="text-sm font-medium text-emerald-700">
              {successMessage}
            </p>
          </div>
        )}

        {/* ======================================
            SERVER ERROR
        ====================================== */}

        {serverError && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle
              size={18}
              className="shrink-0 text-red-600"
            />

            <p className="text-sm font-medium text-red-700">
              {serverError}
            </p>
          </div>
        )}

        {/* ======================================
            PROFILE HEADER
        ====================================== */}

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="relative h-20 w-20 shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-primary text-2xl font-bold text-white">
                {profilePicturePreview ? (
                  <img
                    src={profilePicturePreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitial()
                )}
              </div>

              {editing && (
                <>
                  <label
                    htmlFor="profile-picture-upload"
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-primary text-white shadow-sm transition hover:bg-primary-hover"
                    title="Change profile picture"
                  >
                    <Camera size={16} />
                  </label>

                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-text">
                {profile.first_name}{" "}
                {profile.last_name}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {profile.headline ||
                  "Professional headline not added"}
              </p>

              {profile.location && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin size={16} />
                  {profile.location}
                </div>
              )}

              {editing && (
                <p className="mt-2 text-xs text-text-secondary">
                  Click the camera icon to change your profile picture.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ======================================
            PROFILE CONTENT - 2 COLUMN
        ====================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* ====================================
              MAIN CONTENT
          ==================================== */}

          <div className="space-y-5 xl:col-span-2">

            <PersonalInfoSection
              formData={formData}
              handleChange={handleChange}
              editing={editing}
              errors={errors}
              ProfileSection={ProfileSection}
              FormField={FormField}
            />

            <ProfessionalInfoSection
              formData={formData}
              handleChange={handleChange}
              editing={editing}
              errors={errors}
              ProfileSection={ProfileSection}
              FormField={FormField}
            />

            <ExperienceSection
              experiences={experiences}
              experienceLoading={experienceLoading}
              experienceSaving={experienceSaving}
              editing={editing}
              handleAddExperienceClick={
                handleAddExperienceClick
              }
              handleEditExperience={
                handleEditExperience
              }
              handleDeleteExperience={
                handleDeleteExperience
              }
              ProfileSection={ProfileSection}
            />

            <EducationSection
              educations={educations}
              educationLoading={educationLoading}
              educationSaving={educationSaving}
              editing={editing}
              handleAddEducationClick={
                handleAddEducationClick
              }
              handleEditEducation={
                handleEditEducation
              }
              handleDeleteEducation={
                handleDeleteEducation
              }
              ProfileSection={ProfileSection}
            />

          </div>

          {/* ====================================
              SIDE CONTENT
          ==================================== */}

          <div className="space-y-5">

            <SocialLinksSection
              formData={formData}
              handleChange={handleChange}
              editing={editing}
              errors={errors}
              ProfileSection={ProfileSection}
              FormField={FormField}
            />

            <SkillsSection
              skills={skills}
              skillName={skillName}
              setSkillName={setSkillName}
              skillProficiency={skillProficiency}
              setSkillProficiency={
                setSkillProficiency
              }
              skillYears={skillYears}
              setSkillYears={setSkillYears}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={
                handleDeleteSkill
              }
              editing={editing}
              skillsLoading={skillsLoading}
              skillSaving={skillSaving}
              skillError={skillError}
              ProfileSection={ProfileSection}
            />

          </div>
        </div>
      </div>

      {/* ======================================
          EXPERIENCE MODAL
      ====================================== */}

      <ExperienceModal
        showExperienceForm={
          showExperienceForm
        }
        editingExperienceId={
          editingExperienceId
        }
        experienceForm={experienceForm}
        experienceSaving={experienceSaving}
        experienceFormErrors={
          experienceFormErrors
        }
        handleExperienceChange={
          handleExperienceChange
        }
        handleSaveExperience={
          handleSaveExperience
        }
        resetExperienceForm={
          resetExperienceForm
        }
        FormField={FormField}
      />

      {/* ======================================
          EDUCATION MODAL
      ====================================== */}

      <EducationModal
        showEducationForm={
          showEducationForm
        }
        editingEducationId={
          editingEducationId
        }
        educationForm={educationForm}
        educationSaving={educationSaving}
        educationFormErrors={
          educationFormErrors
        }
        handleEducationChange={
          handleEducationChange
        }
        handleSaveEducation={
          handleSaveEducation
        }
        resetEducationForm={
          resetEducationForm
        }
        FormField={FormField}
      />
    </>
  );

  if (embedded) {
    return profileContent;
  }

  return (
    <CandidateDashboardLayout profile={profile}>
      {profileContent}
    </CandidateDashboardLayout>
  );
}

export default CandidateProfile;

