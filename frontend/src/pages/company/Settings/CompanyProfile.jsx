import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Phone,
  UserRound,
  MapPin,
  FileText,
  Pencil,
  CheckCircle2,
  Clock3,
  XCircle,
  ExternalLink,
  Save,
  X,
} from "lucide-react";

import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../../../services/company/companyService";

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCompanyProfile();
      const data = response.data;

      setCompany(data);
      setFormData(data);
    } catch (err) {
      console.error("Failed to fetch company profile:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to load company profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setSuccess("");
    setError("");
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(company);
    setEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      const fields = [
        "company_name",
        "industry",
        "company_size",
        "website",
        "description",
        "contact_person",
        "contact_phone",
        "country",
        "state",
        "city",
        "address",
      ];

      fields.forEach((field) => {
        data.append(field, formData[field] || "");
      });

      /*
       * Existing files are not re-uploaded here.
       * File replacement can be handled separately.
       */

      const response = await updateCompanyProfile(data);

      setCompany(response.data);
      setFormData(response.data);
      setEditing(false);
      setSuccess("Company profile updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Failed to update company profile:", err);

      const responseData = err?.response?.data;

      if (typeof responseData === "object") {
        const firstError = Object.values(responseData)?.[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : firstError || "Unable to update company profile."
        );
      } else {
        setError("Unable to update company profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const getApprovalStatus = () => {
    switch (company?.approval_status) {
      case "APPROVED":
        return {
          label: "Approved",
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };

      case "REJECTED":
        return {
          label: "Rejected",
          icon: XCircle,
          className: "bg-red-50 text-red-700 border-red-200",
        };

      default:
        return {
          label: "Pending",
          icon: Clock3,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
  };

  const status = getApprovalStatus();
  const StatusIcon = status.icon;

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Building2 className="mx-auto h-10 w-10 text-slate-400" />

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Company Profile Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          We couldn't find your company profile.
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Settings
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Profile Information
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your company information and verification details.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle size={18} />
          {error}
        </div>
      )}

      {/* Company Hero */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            {/* Logo */}
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 text-blue-600 shadow-md">
              {company.company_logo ? (
                <img
                  src={company.company_logo}
                  alt={company.company_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={34} />
              )}
            </div>

            {/* Company Details */}
            <div className="flex-1 sm:pb-1">
              <h2 className="text-xl font-bold text-slate-900">
                {company.company_name || "Company"}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                {company.industry && (
                  <span>{company.industry}</span>
                )}

                {company.industry && company.company_size && (
                  <span className="text-slate-300">•</span>
                )}

                {company.company_size && (
                  <span>{company.company_size}</span>
                )}
              </div>
            </div>

            {/* Approval */}
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
            >
              <StatusIcon size={15} />
              {status.label}
            </div>
          </div>
        </div>
      </section>

      {/* Rejection Reason */}
      {company.approval_status === "REJECTED" &&
        company.rejection_reason && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h3 className="text-sm font-semibold text-red-800">
              Rejection Reason
            </h3>

            <p className="mt-1 text-sm leading-6 text-red-700">
              {company.rejection_reason}
            </p>
          </section>
        )}

      {/* Profile Content */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Company Information */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Company Information
              </h2>

              <p className="text-xs text-slate-500">
                Basic information about your company.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            <ProfileField
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              editing={editing}
              onChange={handleChange}
            />

            <ProfileField
              label="Industry"
              name="industry"
              value={formData.industry}
              editing={editing}
              onChange={handleChange}
            />

            <ProfileField
              label="Company Size"
              name="company_size"
              value={formData.company_size}
              editing={editing}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Website
              </label>

              {editing ? (
                <input
                  type="url"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              ) : company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Globe size={16} />
                  {company.website}
                  <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-sm text-slate-400">
                  Not provided
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              {editing ? (
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              ) : (
                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                  {company.description || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Contact Information
              </h2>

              <p className="text-xs text-slate-500">
                Primary company contact details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            <ProfileField
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              editing={editing}
              onChange={handleChange}
            />

            <ProfileField
              label="Contact Phone"
              name="contact_phone"
              value={formData.contact_phone}
              editing={editing}
              onChange={handleChange}
              icon={Phone}
            />

          </div>
        </section>

        {/* Location */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Location
              </h2>

              <p className="text-xs text-slate-500">
                Company office location.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">

            <ProfileField
              label="Country"
              name="country"
              value={formData.country}
              editing={editing}
              onChange={handleChange}
            />

            <ProfileField
              label="State"
              name="state"
              value={formData.state}
              editing={editing}
              onChange={handleChange}
            />

            <ProfileField
              label="City"
              name="city"
              value={formData.city}
              editing={editing}
              onChange={handleChange}
            />

            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              {editing ? (
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  {company.address || "Not provided"}
                </p>
              )}
            </div>

          </div>
        </section>

        {/* Verification */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Verification
              </h2>

              <p className="text-xs text-slate-500">
                Company verification and submitted document.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Approval Status
              </p>

              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
              >
                <StatusIcon size={15} />
                {status.label}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Verification Document
              </p>

              {company.verification_document ? (
                <a
                  href={company.verification_document}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <FileText size={17} />
                  View Document
                  <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-sm text-slate-400">
                  No document available
                </p>
              )}
            </div>

          </div>
        </section>

        {/* Edit Actions */}
        {editing && (
          <div className="sticky bottom-4 z-30 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>

          </div>
        )}

      </form>
    </div>
  );
};

/* Reusable Field */
const ProfileField = ({
  label,
  name,
  value,
  editing,
  onChange,
  icon: Icon,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {editing ? (
        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          )}

          <input
            type="text"
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
              Icon ? "pl-10" : ""
            }`}
          />
        </div>
      ) : (
        <p className="text-sm font-medium text-slate-700">
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
};

export default CompanyProfile;