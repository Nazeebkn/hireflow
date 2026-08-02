import api from "../api";

export const uploadResume = async (resume) => {

  const formData = new FormData();

  formData.append("resume", resume);

  const response = await api.patch(
    "/candidate/profile/resume/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};