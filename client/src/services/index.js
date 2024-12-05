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

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}
export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}
export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`,
    id
  );

  return data;
}
export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}
export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
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

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}
export async function fetchStudentViewCourseDetailsService(courseId,studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}


export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}