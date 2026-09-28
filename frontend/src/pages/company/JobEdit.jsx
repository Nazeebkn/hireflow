import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { validateJobForm } from "../../utils/jobValidation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  MapPin,
  Save,
  X,
} from "lucide-react";

import CompanyDashboardLayout from "../../components/company/dashboard/CompanyDashboardLayout";

import { getCompanyProfile } from "../../services/company/companyService";

import {
  getCompanyJobs,
  updateJob,
} from "../../services/company/jobService";


/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  title: "",
  description: "",
  location: "",
  work_mode: "ONSITE",
  employment_type: "FULL_TIME",
  skills: "",
  experience_required: "",
  education: "",
  position: "",
  minimum_salary: "",
  maximum_salary: "",
  application_deadline: "",
};


/* =========================================================
   JOB EDIT
========================================================= */

function JobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] =
    useState(initialForm);

  const [companyProfile, setCompanyProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});


  /* =====================================================
     FETCH COMPANY PROFILE
  ===================================================== */

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const data = await getCompanyProfile();

        setCompanyProfile(data);
      } catch (profileError) {
        console.error(
          "Failed to load company profile:",
          profileError
        );
      }
    };

    fetchCompanyProfile();
  }, []);


  /* =====================================================
     FETCH JOB
  ===================================================== */

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCompanyJobs();

        const jobs = Array.isArray(data)
          ? data
          : data?.jobs ||
            data?.results ||
            [];

        const selectedJob = jobs.find(
          (item) =>
            String(item.id) ===
            String(id)
        );

        if (!selectedJob) {
          setError("Job not found.");
          return;
        }

        // Closed jobs cannot be edited
        if (
          String(selectedJob.status).toUpperCase() ===
          "CLOSED"
        ) {
          setError(
            "Closed jobs cannot be edited."
          );
          return;
        }

        setFormData({
          title: selectedJob.title || "",

          description:
            selectedJob.description || "",

          location:
            selectedJob.location || "",

          work_mode:
            selectedJob.work_mode || "ONSITE",

          employment_type:
            selectedJob.employment_type ||
            "FULL_TIME",

          skills:
            selectedJob.skills || "",

          experience_required:
            selectedJob.experience_required ||
            "",

          education:
            selectedJob.education || "",

          position:
            selectedJob.position || "",

          minimum_salary:
            selectedJob.minimum_salary ??
            "",

          maximum_salary:
            selectedJob.maximum_salary ??
            "",

          application_deadline:
            selectedJob.application_deadline
              ? String(
                  selectedJob.application_deadline
                ).slice(0, 10)
              : "",
        });

      } catch (fetchError) {
        console.error(
          "Failed to load job:",
          fetchError
        );

        setError(
          fetchError?.response?.data?.message ||
            fetchError?.response?.data?.detail ||
            "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear individual field error
    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    // Clear general error
    setError("");
  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setFieldErrors({});


    /* ---------------------------------------------
       Prepare data
    --------------------------------------------- */

    const jobData = {
      title: formData.title.trim(),

      description:
        formData.description.trim(),

      location:
        formData.location.trim(),

      work_mode:
        formData.work_mode,

      employment_type:
        formData.employment_type,

      skills:
        formData.skills.trim(),

      experience_required:
        formData.experience_required.trim(),

      education:
        formData.education.trim(),

      position:
        formData.position.trim(),

      minimum_salary:
        formData.minimum_salary === ""
          ? null
          : Number(formData.minimum_salary),

      maximum_salary:
        formData.maximum_salary === ""
          ? null
          : Number(formData.maximum_salary),

      application_deadline:
        formData.application_deadline ||
        null,
    };


    /* ---------------------------------------------
       FRONTEND VALIDATION
    --------------------------------------------- */

    const validationErrors =
      validateJobForm(jobData);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setFieldErrors(validationErrors);

      setError(
        "Please correct the highlighted fields."
      );

      return;
    }


    /* ---------------------------------------------
       SAVE
    --------------------------------------------- */

    setSaving(true);

    try {
      const response = await updateJob(
        id,
        jobData
      );

      console.log(
        "Job updated successfully:",
        response
      );


      /* -------------------------------------------
         Navigate to Job Details
         with success toast message
      ------------------------------------------- */

      navigate(
        `/company/jobs/${id}`,
        {
          state: {
            successMessage:
              "Job updated successfully.",
          },
        }
      );

    } catch (submitError) {
      console.error(
        "Failed to update job:",
        submitError
      );

      const responseData =
        submitError?.response?.data;


      /*
       * Django REST Framework validation errors
       */

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const possibleFieldErrors = {};

        Object.entries(
          responseData
        ).forEach(
          ([field, messages]) => {

            // General message
            if (field === "message") {
              return;
            }

            if (
              Array.isArray(messages)
            ) {
              possibleFieldErrors[field] =
                messages.join(" ");

            } else if (
              typeof messages === "string"
            ) {
              possibleFieldErrors[field] =
                messages;
            }
          }
        );


        if (
          Object.keys(
            possibleFieldErrors
          ).length > 0
        ) {
          setFieldErrors(
            possibleFieldErrors
          );
        }


        setError(
          responseData.message ||
            responseData.detail ||
            "Please correct the highlighted fields."
        );

      } else {
        setError(
          "Failed to update the job. Please try again."
        );
      }

    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    navigate(
      `/company/jobs/${id}`
    );
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <CompanyDashboardLayout
        title="Edit Job"
        subtitle="Update and manage your job posting."
        companyProfile={companyProfile}
      >

        <div className="flex min-h-[60vh] items-center justify-center">

          <div className="flex flex-col items-center gap-4">

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="text-sm text-text-secondary">
              Loading job details...
            </p>

          </div>

        </div>

      </CompanyDashboardLayout>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !formData.title) {
    return (
      <CompanyDashboardLayout
        title="Edit Job"
        subtitle="Update and manage your job posting."
        companyProfile={companyProfile}
      >

        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">

          <div className="w-full rounded-2xl border border-red-100 bg-red-50 p-6 text-center">

            <h2 className="text-lg font-semibold text-red-700">
              Unable to edit job
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={handleCancel}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <ArrowLeft size={16} />
              Back to Job
            </button>

          </div>

        </div>

      </CompanyDashboardLayout>
    );
  }


  /* =====================================================
     FIELD COMPONENT
  ===================================================== */

  const FieldError = ({ name }) => {
    if (!fieldErrors[name]) {
      return null;
    }

    return (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {fieldErrors[name]}
      </p>
    );
  };


  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <CompanyDashboardLayout
      title="Edit Job"
      subtitle="Update and manage your job posting."
      companyProfile={companyProfile}
    >

      <div className="mx-auto w-full max-w-5xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">

          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Job
          </button>


          <div>

            <h1 className="text-2xl font-bold text-text sm:text-3xl">
              Edit Job
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              Update the details of your job posting.
            </p>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

          </div>
        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-blue-100 bg-surface shadow-sm">

            <div className="border-b border-blue-100 bg-blue-50/50 px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">

                  <BriefcaseBusiness
                    size={18}
                  />

                </div>

                <div>

                  <h2 className="text-lg font-semibold text-primary">
                    Basic Information
                  </h2>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    Main details about the job.
                  </p>

                </div>

              </div>

            </div>


            <div className="grid grid-cols-1 gap-5 p-5 sm:p-6">


              {/* Job Title */}

              <div>

                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-text"
                >
                  Job Title
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    fieldErrors.title
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <FieldError name="title" />

              </div>


              {/* Position */}

              <div>

                <label
                  htmlFor="position"
                  className="mb-2 block text-sm font-semibold text-text"
                >
                  Position
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    fieldErrors.position
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <FieldError name="position" />

              </div>


              {/* Description */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-text"
                >
                  Job Description
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={7}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the responsibilities, requirements and expectations..."
                  className={`w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    fieldErrors.description
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <div className="mt-1.5 flex justify-between">

                  <FieldError name="description" />

                  <span className="ml-auto text-xs text-text-secondary">
                    {formData.description.length} characters
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              JOB DETAILS
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm">

            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">

              <h2 className="text-lg font-semibold text-primary">
                Job Details
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                Employment and workplace information.
              </p>

            </div>


            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">


              {/* Location */}

              <div>

                <label
                  htmlFor="location"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-text"
                >
                  <MapPin
                    size={15}
                    className="text-emerald-600"
                  />
                  Location
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kochi, Kerala"
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    fieldErrors.location
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <FieldError name="location" />

              </div>


              {/* Work Mode */}

              <div>

                <label
                  htmlFor="work_mode"
                  className="mb-2 block text-sm font-semibold text-text"
                >
                  Work Mode
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="work_mode"
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                    fieldErrors.work_mode
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border"
                  }`}
                >
                  <option value="ONSITE">
                    On-site
                  </option>

                  <option value="REMOTE">
                    Remote
                  </option>

                  <option value="HYBRID">
                    Hybrid
                  </option>
                </select>

                <FieldError name="work_mode" />

              </div>


              {/* Employment Type */}

              <div>

                <label
                  htmlFor="employment_type"
                  className="mb-2 block text-sm font-semibold text-text"
                >
                  Employment Type
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                    fieldErrors.employment_type
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border"
                  }`}
                >
                  <option value="FULL_TIME">
                    Full Time
                  </option>

                  <option value="PART_TIME">
                    Part Time
                  </option>

                  <option value="CONTRACT">
                    Contract
                  </option>

                  <option value="INTERNSHIP">
                    Internship
                  </option>

                  <option value="FREELANCE">
                    Freelance
                  </option>
                </select>

                <FieldError name="employment_type" />

              </div>


              {/* Experience */}

              <div>

                <label
                  htmlFor="experience_required"
                  className="mb-2 block text-sm font-semibold text-text"
                >
                  Experience Required
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="experience_required"
                  name="experience_required"
                  type="text"
                  value={
                    formData.experience_required
                  }
                  onChange={handleChange}
                  placeholder="e.g. 2-4 years"
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    fieldErrors.experience_required
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <FieldError name="experience_required" />

              </div>


              {/* Education */}

              <div>

                <label
                  htmlFor="education"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-text"
                >
                  <GraduationCap
                    size={15}
                    className="text-indigo-600"
                  />
                  Education
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="education"
                  name="education"
                  type="text"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech / BCA / MCA"
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    fieldErrors.education
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <FieldError name="education" />

              </div>


              {/* Application Deadline */}

              <div>

                <label
                  htmlFor="application_deadline"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-text"
                >
                  <CalendarDays
                    size={15}
                    className="text-rose-600"
                  />
                  Application Deadline
                </label>

                <input
                  id="application_deadline"
                  name="application_deadline"
                  type="date"
                  value={
                    formData.application_deadline
                  }
                  onChange={handleChange}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:ring-2 ${
                    fieldErrors.application_deadline
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <FieldError
                  name="application_deadline"
                />

              </div>

            </div>

          </section>


          {/* =================================================
              SALARY & SKILLS
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-surface shadow-sm">

            <div className="border-b border-emerald-100 bg-emerald-50/50 px-5 py-4 sm:px-6">

              <h2 className="text-lg font-semibold text-primary">
                Salary & Skills
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                Compensation and required expertise.
              </p>

            </div>


            <div className="space-y-5 p-5 sm:p-6">


              {/* Salary */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                {/* Minimum Salary */}

                <div>

                  <label
                    htmlFor="minimum_salary"
                    className="mb-2 block text-sm font-semibold text-text"
                  >
                    Minimum Salary
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
                      ₹
                    </span>

                    <input
                      id="minimum_salary"
                      name="minimum_salary"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={
                        formData.minimum_salary
                      }
                      onChange={handleChange}
                      placeholder="e.g. 300000"
                      className={`w-full rounded-xl border bg-surface py-3 pl-8 pr-4 text-sm text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        fieldErrors.minimum_salary
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-border focus:border-primary focus:ring-primary/10"
                      }`}
                    />

                  </div>

                  <FieldError
                    name="minimum_salary"
                  />

                </div>


                {/* Maximum Salary */}

                <div>

                  <label
                    htmlFor="maximum_salary"
                    className="mb-2 block text-sm font-semibold text-text"
                  >
                    Maximum Salary
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
                      ₹
                    </span>

                    <input
                      id="maximum_salary"
                      name="maximum_salary"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={
                        formData.maximum_salary
                      }
                      onChange={handleChange}
                      placeholder="e.g. 600000"
                      className={`w-full rounded-xl border bg-surface py-3 pl-8 pr-4 text-sm text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        fieldErrors.maximum_salary
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-border focus:border-primary focus:ring-primary/10"
                      }`}
                    />

                  </div>

                  <FieldError
                    name="maximum_salary"
                  />

                </div>

              </div>


              {/* Skills */}

              <div>

                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-semibold text-text"
                >
                  Required Skills
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="skills"
                  name="skills"
                  rows={4}
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Django, Python, PostgreSQL, REST API"
                  className={`w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    fieldErrors.skills
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />

                <p className="mt-1.5 text-xs text-text-secondary">
                  Separate multiple skills using commas.
                </p>

                <FieldError name="skills" />

              </div>

            </div>

          </section>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:justify-end sm:p-5">

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={17} />
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Save size={17} />

              {saving
                ? "Saving Changes..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>

    </CompanyDashboardLayout>
  );
}

export default JobEdit;