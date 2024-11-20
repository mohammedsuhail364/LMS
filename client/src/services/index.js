import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  try {
    const { data } = await axiosInstance.post("/auth/register", {
      ...formData,
      role: "user",
    });
    return data;
  } catch (error) {
    console.log("Error in registerService:", error.message || error);
    throw error;
  }
}
export async function loginService(formData) {
  try {
    const { data } = await axiosInstance.post("/auth/login", {
      ...formData,
    });
    return data;
  } catch (error) {
    console.log("Error in registerService:", error.message || error);
    throw error;
  }
}
export async function checkAuthService() {
  try {
    const { data } = await axiosInstance.get("/auth/check-auth");

    return data;
  } catch (error) {
    console.log("Error in registerService:", error.message || error);
    throw error;
  }
}
export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted); // Pass the calculated percentage to the callback
    },
  });
  return data;
}
export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`, id);

  return data;
}
