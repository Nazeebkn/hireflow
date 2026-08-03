import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  createCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
} from "../../../services/company/companyService";

import {
  validateCompanyName,
  validateWebsite,
  validateDescription,
  validateContactPerson,
  validateContactPhone,
} from "../../../utils/validation";

import {
  INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
} from "../../../constants/companyOptions";

import CompanyInformationSection from "./CompanyInformationSection";
import ContactInformationSection from "./ContactInformationSection";
import VerificationSection from "./VerificationSection";
import CompanySubmitButton from "./CompanySubmitButton";

function CompanyProfileForm() {
  const [loading, setLoading] = useState(false);

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    company_logo: null,
    verification_document: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const data = await getCompanyProfile();

      setFormData({
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
        company_logo: data.company_logo || null,
        verification_document:
          data.verification_document || null,
      });

      setIsUpdateMode(true);
    } catch (error) {
      // First profile creation
    }
  };

const handleChange = (event) => {
  const { name, value } = event.target;


  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};

  const handleFileChange = (event) => {
    const { name, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files[0],
    }));
  };
    const validateForm = () => {


  const validationErrors = {
    company_name: validateCompanyName(formData.company_name),
    website: validateWebsite(formData.website),
    description: validateDescription(formData.description),
    contact_person: validateContactPerson(
      formData.contact_person
    ),
    contact_phone: validateContactPhone(
      formData.contact_phone
    ),
    industry: !formData.industry
      ? "Please select an industry."
      : "",
    company_size: !formData.company_size
      ? "Please select company size."
      : "",
    country: !formData.country.trim()
      ? "Country is required."
      : "",
    state: !formData.state.trim()
      ? "State is required."
      : "",
    city: !formData.city.trim()
      ? "City is required."
      : "",
    address: !formData.address.trim()
      ? "Address is required."
      : "",
    verification_document: !formData.verification_document
      ? "Verification document is required."
      : "",
  };


  setErrors(validationErrors);

  return Object.values(validationErrors).every(
    (error) => !error
  );
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          payload.append(key, value);
        }
      });

      if (isUpdateMode) {
        await updateCompanyProfile(payload);

        toast.success(
          "Company profile updated successfully."
        );
      } else {
        await createCompanyProfile(payload);

        toast.success(
          "Company profile submitted successfully."
        );

        setIsUpdateMode(true);
        navigate("/company/pending-approval");
      }

      await fetchCompanyProfile();

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };
    return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10"
    >
      <CompanyInformationSection
        formData={formData}
        errors={errors}
        onChange={handleChange}
        industryOptions={INDUSTRY_OPTIONS}
        companySizeOptions={COMPANY_SIZE_OPTIONS}
      />

      <ContactInformationSection
        formData={formData}
        errors={errors}
        onChange={handleChange}
      />

      <VerificationSection
        formData={formData}
        errors={errors}
        onFileChange={handleFileChange}
      />

      <CompanySubmitButton
        loading={loading}
      />
    </form>
  );
}

export default CompanyProfileForm;