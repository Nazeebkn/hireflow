import AuthInput from "../../auth/AuthInput";
import { Camera, UploadCloud } from "lucide-react";
import { validateProfilePhoto } from "../../../utils/validation";

import { useEffect, useState } from "react";

function PersonalDetailsStep({ formData, errors, onChange, onPhotoChange }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!formData.profile_picture) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.profile_picture);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.profile_picture]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const error = validateProfilePhoto(file);

    if (error) {
      onPhotoChange(null, error);
      event.target.value = "";
      return;
    }
    onPhotoChange(file);

    // Reset input
    event.target.value = "";
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-4">
        {/* Profile Photo */}
        <div className="col-span-12 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/30 bg-primary/5">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera size={28} className="text-primary" />
                  )}
                </div>

                <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary shadow-md">
                  <UploadCloud size={16} className="text-white" />
                </div>
              </div>

              <h3 className="mt-4 text-sm font-semibold text-text-primary">
                Profile Photo
              </h3>

              <p className="mt-1 text-center text-xs text-text-secondary">
                Upload a professional profile picture.
              </p>

              <label
                htmlFor="profile-photo"
                className="mt-4 w-full cursor-pointer rounded-lg border border-primary bg-primary px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-primary/90"
              >
                {preview ? "Change Photo" : "Choose Photo"}
              </label>

              <input
                id="profile-photo"
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
              />

              {errors.profile_picture ? (
                <p className="mt-3 text-center text-sm text-red-500">
                  {errors.profile_picture}
                </p>
              ) : (
                <p className="mt-3 text-center text-[11px] leading-5 text-text-secondary">
                  Supports JPG, JPEG & PNG
                  <br />
                  Maximum file size: 5 MB
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="col-span-12 lg:col-span-10">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <AuthInput
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={onChange}
                error={errors.first_name}
                placeholder="John"
              />

              <AuthInput
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={onChange}
                error={errors.last_name}
                placeholder="Doe"
              />

              <AuthInput
                name="phone_number"
                label="Phone Number"
                value={formData.phone_number}
                onChange={onChange}
                error={errors.phone_number}
                placeholder="+91 9876543210"
              />

              <AuthInput
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={onChange}
                error={errors.date_of_birth}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={onChange}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none transition-all duration-200 focus:border-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>

                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender}</p>
                )}
              </div>

              <AuthInput
                name="location"
                label="Current Location"
                value={formData.location}
                onChange={onChange}
                error={errors.location}
              />
            </div>

            <div className="mt-3 space-y-3">
              <AuthInput
                name="headline"
                label="Professional Headline"
                value={formData.headline}
                onChange={onChange}
                error={errors.headline}
                placeholder="Backend Developer | Django | PostgreSQL"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">
                  About Me
                </label>

                <textarea
                  name="about"
                  rows="2"
                  value={formData.about}
                  onChange={onChange}
                  placeholder="Write a short professional summary..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all duration-200 focus:border-primary"
                />

                {errors.about && (
                  <p className="text-sm text-red-500">{errors.about}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetailsStep;
