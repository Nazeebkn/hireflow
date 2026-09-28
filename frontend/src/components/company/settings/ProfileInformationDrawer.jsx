import { useEffect, useState } from "react";
import {
  X,
  Building2,
  UserRound,
  Phone,
  Globe,
  MapPin,
  FileText,
  Save,
  Loader2,
  Upload,
  Pencil,
} from "lucide-react";

import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../../../services/company/companyService";

const EMPTY_FORM = {
  company_name: "",
  industry: "",
  company_size: "",
  website: "",
  description: "",
  contact_person: "",
  contact_phone: "",
  country: "",
  state: "",
  city: "",
  address: "",
};

const ProfileInformationDrawer = ({ isOpen, onClose }) => {
  const [company, setCompany] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [originalFormData, setOriginalFormData] = useState(EMPTY_FORM);

  const [companyLogo, setCompanyLogo] = useState(null);
  const [verificationDocument, setVerificationDocument] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");
        setIsEditing(false);

        const data = await getCompanyProfile();

        setCompany(data);

        const profileData = {
          company_name: data.company_name || "",
          industry: data.industry || "",
          company_size: data.company_size || "",
          website: data.website || "",
          description: data.description || "",
          contact_person: data.contact_person || "",
          contact_phone: data.contact_phone || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          address: data.address || "",
        };

        setFormData(profileData);
        setOriginalFormData(profileData);

        setCompanyLogo(null);
        setVerificationDocument(null);
      } catch (err) {
        console.error("Failed to load company profile:", err);

        const apiError = err?.response?.data;

        if (apiError && typeof apiError === "object") {
          const firstError = Object.values(apiError).flat()[0];

          setError(
            firstError || "Failed to load company information."
          );
        } else {
          setError("Failed to load company information.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setFormData(originalFormData);

    setCompanyLogo(null);
    setVerificationDocument(null);

    setIsEditing(false);

    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (companyLogo) {
        data.append("company_logo", companyLogo);
      }

      if (verificationDocument) {
        data.append(
          "verification_document",
          verificationDocument
        );
      }

      const updatedCompany = await updateCompanyProfile(data);

      setCompany(updatedCompany);

      const updatedFormData = {
        company_name: updatedCompany.company_name || "",
        industry: updatedCompany.industry || "",
        company_size: updatedCompany.company_size || "",
        website: updatedCompany.website || "",
        description: updatedCompany.description || "",
        contact_person: updatedCompany.contact_person || "",
        contact_phone: updatedCompany.contact_phone || "",
        country: updatedCompany.country || "",
        state: updatedCompany.state || "",
        city: updatedCompany.city || "",
        address: updatedCompany.address || "",
      };

      setFormData(updatedFormData);
      setOriginalFormData(updatedFormData);

      setCompanyLogo(null);
      setVerificationDocument(null);

      setSuccess("Company information updated successfully.");
      setIsEditing(false);
    } catch (err) {
      console.error(
        "Update error:",
        err?.response?.data
      );

      const apiError = err?.response?.data;

      if (apiError && typeof apiError === "object") {
        const firstError = Object.values(apiError).flat()[0];

        setError(
          firstError || "Failed to update company information."
        );
      } else {
        setError("Failed to update company information.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;

    setIsEditing(false);
    setError("");
    setSuccess("");
    setCompanyLogo(null);
    setVerificationDocument(null);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-[60] flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Profile Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                View and manage your company information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2
                size={28}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : (
            <div className="space-y-8 p-6">
              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              {/* Company Logo */}
              <section>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Company Logo
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Your current company logo.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {companyLogo ? (
                      <img
                        src={URL.createObjectURL(companyLogo)}
                        alt="Company logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : company?.company_logo ? (
                      <img
                        src={company.company_logo}
                        alt="Company logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2
                        size={30}
                        className="text-slate-300"
                      />
                    )}
                  </div>

                  {isEditing && (
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <Upload size={16} />

                      Change Logo

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setCompanyLogo(
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              </section>

              {/* Company Information */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Building2
                    size={17}
                    className="text-blue-600"
                  />

                  <h3 className="text-sm font-semibold text-slate-900">
                    Company Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Company Name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />

                  <FormField
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />

                  <FormField
                    label="Company Size"
                    name="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />

                  <FormField
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<Globe size={15} />}
                    required
                  />

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={4}
                      className={`w-full resize-none rounded-xl border px-3.5 py-3 text-sm text-slate-900 outline-none transition ${
                        isEditing
                          ? "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          : "cursor-default border-slate-100 bg-slate-50 text-slate-600"
                      }`}
                    />
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <UserRound
                    size={17}
                    className="text-violet-600"
                  />

                  <h3 className="text-sm font-semibold text-slate-900">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Contact Person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />

                  <FormField
                    label="Contact Phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={<Phone size={15} />}
                    required
                  />
                </div>
              </section>

              {/* Location */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <MapPin
                    size={17}
                    className="text-emerald-600"
                  />

                  <h3 className="text-sm font-semibold text-slate-900">
                    Location
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />

                  <FormField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />

                  <FormField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full resize-none rounded-xl border px-3.5 py-3 text-sm text-slate-900 outline-none transition ${
                        isEditing
                          ? "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          : "cursor-default border-slate-100 bg-slate-50 text-slate-600"
                      }`}
                    />
                  </div>
                </div>
              </section>

              {/* Verification */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <FileText
                    size={17}
                    className="text-amber-600"
                  />

                  <h3 className="text-sm font-semibold text-slate-900">
                    Verification Document
                  </h3>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Current verification document
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {company?.verification_document
                          ? "A verification document is uploaded."
                          : "No verification document available."}
                      </p>
                    </div>

                    {company?.verification_document && (
                      <a
                        href={company.verification_document}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-slate-50"
                      >
                        View Document
                      </a>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                        <Upload size={16} />

                        {verificationDocument
                          ? verificationDocument.name
                          : "Replace Document"}

                        <input
                          type="file"
                          accept=".pdf,image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) =>
                            setVerificationDocument(
                              e.target.files?.[0] || null
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleEdit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading || saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  icon,
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
              disabled
                ? "text-slate-300"
                : "text-slate-400"
            }`}
          >
            {icon}
          </span>
        )}

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded-xl border py-2.5 text-sm outline-none transition ${
            icon ? "pl-9 pr-3.5" : "px-3.5"
          } ${
            disabled
              ? "cursor-default border-slate-100 bg-slate-50 text-slate-600"
              : "border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />
      </div>
    </div>
  );
};

export default ProfileInformationDrawer;