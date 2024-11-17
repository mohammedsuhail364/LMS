import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { createContext, useState } from "react";
export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculamFormData, setCourseCurriculamFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
  
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false)
  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculamFormData,
        setCourseCurriculamFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
