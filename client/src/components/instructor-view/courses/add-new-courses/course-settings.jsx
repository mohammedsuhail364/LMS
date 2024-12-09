import MediaProgressbar from "@/components/media-progress-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    mediaUploadProgress,
    setMediaUploadProgress,
  } = useContext(InstructorContext);
  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        // console.log(response);
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
        <div className="p-4">
          {mediaUploadProgress ? (
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {courseLandingFormData.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className=" flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
