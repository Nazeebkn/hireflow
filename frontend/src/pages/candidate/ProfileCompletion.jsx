import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateName,
  validatePhone,
  validateDateOfBirth,
  validateAbout,
  validateLocation,
  validateHeadline,
  validateEducation,
  validateGraduationYear,
  validateExperienceLevel,
  validateJobTitle,
  validateSkill,
  validateSalary,
  validateInstitution,
  validateQualification,
  validateCompany,
  validateResume,
  validateEmploymentType,
  validateWorkMode,
} from "../../utils/validation";

import {
  createCandidateProfile,
  updateCandidateProfile,
  getCandidateProfile,
} from "../../services/candidate/candidateProfileService";
import { uploadResume } from "../../services/candidate/resumeService";

import { updateJobPreference } from "../../services/candidate/candidateJobPreferenceService";

import { toast } from "sonner";
import { submitCareerDetails } from "../../services/candidate/careerProfileCompletionService";
import { createEducation } from "../../services/candidate/candidateEducationService";
import { createExperience } from "../../services/candidate/candidateExperienceService";
import { createSkill } from "../../services/candidate/candidateSkillService";
import { createJobPreference } from "../../services/candidate/candidateJobPreferenceService";

import ProfileCompletionNavbar from "../../components/candidate/profile-completion/ProfileCompletionNavbar";
import ProfileCompletionHeader from "../../components/candidate/profile-completion/ProfileCompletionHeader";
import ProfileCompletionStepper from "../../components/candidate/profile-completion/ProfileCompletionStepper";
import ProfileCompletionCard from "../../components/candidate/profile-completion/ProfileCompletionCard";
import PersonalDetailsStep from "../../components/candidate/profile-completion/PersonalDetailsStep";
import CareerDetailsStep from "../../components/candidate/profile-completion/CareerDetailsStep";
import ResumePreferenceStep from "../../components/candidate/profile-completion/ResumePreferenceStep";
import StepNavigation from "../../components/candidate/profile-completion/StepNavigation";
import ProfileCompletionFooter from "../../components/candidate/profile-completion/ProfileCompletionFooter";
function ProfileCompletion() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileCreated, setProfileCreated] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
  const checkProfile = async () => {
    try {
      await getCandidateProfile();

      setProfileCreated(true);

    } catch (error) {

      if (error.response?.status === 404) {
        setProfileCreated(false);
      } else {
        console.error(error);
      }

    }
  };

  checkProfile();
}, []);

const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  phone_number: "",
  date_of_birth: "",
  gender: "",
  location: "",            
  headline: "",           
  about: "",               
  profile_picture: null,   
  education: "",
  institution_name: "",
  qualification: "",
  graduation_year: "",
  experience_level: "",
  current_job_title: "",
  current_company: "",
  primary_skill: "",
  preferred_job_role: "",
  preferred_location: "",
  expected_salary: "",
  resume: null,
  employment_type: "",
  work_mode: "",
});

  const [errors, setErrors] = useState({
    profile_picture: "",
    resume: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "experience_level" && value === "FRESHER") {
      setFormData((prev) => ({
        ...prev,
        experience_level: value,
        current_job_title: "",
        current_company: "",
      }));

      return;
    }

    if (name === "education") {
      setFormData((prev) => ({
        ...prev,
        education: value,
        institution_name: "",
        qualification: "",
        graduation_year: "",
      }));

      return;
    }

    if (["phone_number", "graduation_year", "expected_salary"].includes(name)) {
      const numericValue = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }

      return;
    }

    const cleanedValue =
      typeof value === "string"
        ? value.replace(/^\s+/, "").replace(/\s{2,}/g, " ")
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

const handlePhotoChange = (file, error = "") => {
  setErrors((prev) => ({
    ...prev,
    profile_picture: error,
  }));

  if (error) {
    return;
  }

  setFormData((prev) => ({
    ...prev,
    profile_picture: file,
  }));
};

  const handleResumeChange = (file) => {
    // Remove Resume
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        resume: null,
      }));

      setErrors((prev) => ({
        ...prev,
        resume: "",
      }));

      return;
    }

    const error = validateResume(file);

    setErrors((prev) => ({
      ...prev,
      resume: error,
    }));

    if (error) {
      setFormData((prev) => ({
        ...prev,
        resume: null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resume: file,
    }));
  };

 const validateStep1 = () => {
  const newErrors = {
    first_name: validateName(
      formData.first_name,
      "First Name",
      3
    ),

    last_name: validateName(
      formData.last_name,
      "Last Name",
      1
    ),

    phone_number: validatePhone(
      formData.phone_number
    ),

    date_of_birth: validateDateOfBirth(
      formData.date_of_birth
    ),

    gender: formData.gender
      ? ""
      : "Gender is required.",

    location: validateLocation(
      formData.location
    ),

    headline: validateHeadline(
      formData.headline
    ),

    about: validateAbout(
      formData.about
    ),

    profile_picture: formData.profile_picture
      ? ""
      : "Profile photo is required.",
  };

  setErrors((prev) => ({
  ...prev,
  ...newErrors,
  }));

  console.table(newErrors);

  return Object.values(newErrors).every(
    (error) => error === ""
  );
};


  const validateStep2 = () => {
    const newErrors = {
      education: validateEducation(formData.education),

      institution_name: validateInstitution(formData.institution_name),

      qualification: validateQualification(formData.qualification),

      graduation_year: validateGraduationYear(formData.graduation_year),

      experience_level: validateExperienceLevel(formData.experience_level),

      current_job_title:
        formData.experience_level === "FRESHER"
          ? ""
          : validateJobTitle(formData.current_job_title),

      current_company:
        formData.experience_level === "FRESHER"
          ? ""
          : validateCompany(formData.current_company),

      primary_skill: validateSkill(formData.primary_skill),

      preferred_job_role: validateJobTitle(formData.preferred_job_role),

      preferred_location: validateLocation(formData.preferred_location),

      expected_salary: validateSalary(formData.expected_salary),
    };

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.values(newErrors).every((error) => error === "");
  };

const validateStep3 = () => {
  const newErrors = {
    resume: validateResume(formData.resume),
    employment_type: validateEmploymentType(formData.employment_type),
    work_mode: validateWorkMode(formData.work_mode),
  };

  setErrors((prev) => ({
    ...prev,
    ...newErrors,
  }));

  return Object.values(newErrors).every(
    (error) => error === ""
  );
};




  const submitProfile = async () => {
  const payload = new FormData();

  payload.append("first_name", formData.first_name);
  payload.append("last_name", formData.last_name);
  payload.append("phone_number", formData.phone_number);
  payload.append("date_of_birth", formData.date_of_birth);
  payload.append("gender", formData.gender);
  payload.append("location", formData.location);
  payload.append("headline", formData.headline);
  payload.append("about", formData.about);

  if (formData.profile_picture) {
    payload.append(
      "profile_picture",
      formData.profile_picture
    );
  }

  try {
  if (profileCreated) {
    await updateCandidateProfile(payload);
  } else {
    await createCandidateProfile(payload);

    // Profile is now created
    setProfileCreated(true);
  }
} catch (error) {
  console.error(error);

  // If profile already exists, update it instead
  if (
    error.response?.data?.[0] === "Profile already exists."
  ) {
    await updateCandidateProfile(payload);
    setProfileCreated(true);
  } else {
    throw error;
  }
}
};



const submitCareerStep = async () => {
  const payload = {
    education: formData.education,
    institution_name: formData.institution_name,
    qualification: formData.qualification,
    graduation_year: Number(formData.graduation_year),

    experience_level: formData.experience_level,
    current_job_title: formData.current_job_title,
    current_company: formData.current_company,

    primary_skill: formData.primary_skill,

    preferred_job_role: formData.preferred_job_role,
    preferred_location: formData.preferred_location,
    expected_salary: Number(formData.expected_salary),

    employment_type: "FULL_TIME",
  };

  await submitCareerDetails(payload);
};



const submitResumeStep = async () => {

  if (formData.resume) {
    await uploadResume(formData.resume);
  }

  await updateJobPreference({
    preferred_job_role: formData.preferred_job_role,
    preferred_locations: [
      formData.preferred_location,
    ],
    minimum_salary: Number(
      formData.expected_salary
    ),
    maximum_salary: Number(
      formData.expected_salary
    ),
    employment_type:
      formData.employment_type,
    remote_only:
      formData.work_mode === "REMOTE",
  });
};



const submitEducation = async () => {
  const educationPayload = {
    education_level: formData.education,
    institution_name: formData.institution_name,
    field_of_study: formData.qualification,
    end_date: formData.graduation_year
      ? `${formData.graduation_year}-01-01`
      : null,
  };

  await createEducation(educationPayload);
};



const nextStep = async () => {

  if (currentStep === 1) {

    if (!validateStep1()) {
      return;
    }


    try {
      await submitProfile();
      setCurrentStep(2);
    } catch (error) {

      toast.error(
        JSON.stringify(error.response?.data)
      );
    }

    return;
  }


if (currentStep === 2) {

  if (!validateStep2()) {
    return;
  }


  try {
    await submitCareerStep();


    toast.success(
      "Career details saved successfully."
    );

    setCurrentStep(3);

  } catch (error) {
    toast.error(
      JSON.stringify(error.response?.data)
    );
  }

  return;
}

  if (currentStep === 3) {


  if (!validateStep3()) {
    return;
  }

  try {

    await submitResumeStep();
    toast.success(
      "Profile completed successfully."
    );

    // Change this to your next page
    navigate("/candidate/dashboard");

  } catch (error) {
    toast.error(
      JSON.stringify(error.response?.data)
    );
  }

  return;
}
}
// 👇 OUTSIDE nextStep
const previousStep = () => {
  if (currentStep > 1) {
    setCurrentStep((prev) => prev - 1);
  }
};

   

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ProfileCompletionNavbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <ProfileCompletionHeader currentStep={currentStep} totalSteps={3} />

          <div className="mt-4">
            <ProfileCompletionStepper currentStep={currentStep} />
          </div>

          <div className="mt-4">
            <ProfileCompletionCard>
              {currentStep === 1 && (
                <PersonalDetailsStep
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                  onPhotoChange={handlePhotoChange}
                />
              )}

              {currentStep === 2 && (
                <CareerDetailsStep
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
              )}

              {currentStep === 3 && (
                <ResumePreferenceStep
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                  onResumeChange={handleResumeChange}
                />
              )}
            </ProfileCompletionCard>
          </div>

          <div className="mt-4">
            <StepNavigation
              currentStep={currentStep}
              totalSteps={3}
              onNext={nextStep}
              onPrevious={previousStep}
            />
          </div>
        </div>
      </main>

      <ProfileCompletionFooter />
    </div>
  );
}

export default ProfileCompletion;
