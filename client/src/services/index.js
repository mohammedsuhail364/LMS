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
