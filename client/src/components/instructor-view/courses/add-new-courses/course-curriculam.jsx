import MediaProgressbar from "@/components/media-progress-tracking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculam() {
  const {
    courseCurriculamFormData,
    setCourseCurriculamFormData,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    mediaUploadProgress,
    setMediaUploadProgress,
  } = useContext(InstructorContext);
  const bulkUploadInputRef = useRef();
  const handleNewLecture = () => {
    setCourseCurriculamFormData([
      ...courseCurriculamFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };
  function handleCourseTitleChange(event, currentIndex) {
    let copyCourseCurriculamFormData = [...courseCurriculamFormData];

    copyCourseCurriculamFormData[currentIndex] = {
      ...copyCourseCurriculamFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculamFormData(copyCourseCurriculamFormData);
  }
  function handleFreePreviewChange(currentValue, currentIndex) {
    let copyCourseCurriculamFormData = [...courseCurriculamFormData];

    copyCourseCurriculamFormData[currentIndex] = {
      ...copyCourseCurriculamFormData[currentIndex],
      freePreview: currentValue,
    };
    setCourseCurriculamFormData(copyCourseCurriculamFormData);
  }
  async function handleSingleLectureUpload(event, currentIndex) {
    console.log(event.target.files);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let copyCourseCurriculamFormData = [...courseCurriculamFormData];
          copyCourseCurriculamFormData[currentIndex] = {
            ...copyCourseCurriculamFormData[currentIndex],
            videoUrl: response.data.url,
            public_id: response.data.public_id,
          };
          setCourseCurriculamFormData(copyCourseCurriculamFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  // console.log(courseCurriculamFormData);
  // console.log("Uploading:", mediaUploadProgress);
  // console.log("Progress Percentage:", mediaUploadProgressPercentage);
  function isCourseCurriculamFormDataValid() {
    return courseCurriculamFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }
  async function handleReplaceVideo(currentIndex) {
    let copyCourseCurriculamFormData = [...courseCurriculamFormData];
    const getCurrentVideoPublicId =
      copyCourseCurriculamFormData[currentIndex].public_id;
    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );
    // console.log(deleteCurrentMediaResponse);
    if (deleteCurrentMediaResponse.success) {
      copyCourseCurriculamFormData[currentIndex] = {
        ...copyCourseCurriculamFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };
    }
    setCourseCurriculamFormData(copyCourseCurriculamFormData);
  }
  // console.log(courseCurriculamFormData);
  function handleOpenBulkUploadingDialog() {
    bulkUploadInputRef.current.click();
  }
  function areAllCourseCurriculamFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") return true;
        return value === "";
      });
    });
  }
  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();
    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));
    console.log(bulkFormData, "bulk");

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      console.log(response);
      if (response.success) {
        let copyCourseCurriculamFormData =
          areAllCourseCurriculamFormDataObjectsEmpty(courseCurriculamFormData)
            ? []
            : [...courseCurriculamFormData];
        copyCourseCurriculamFormData = [
          ...copyCourseCurriculamFormData,
          ...response.data.map((item, index) => ({
            videoUrl: item.url,
            public_id: item.public_id,
            title: `Lecture ${copyCourseCurriculamFormData.length + (index+1)}`,
            freePreview: false,
          })),
        ];
        setCourseCurriculamFormData(copyCourseCurriculamFormData);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }
    console.log(selectedFiles);
  }
  async function handleDeleteLecture(currentIndex) {
    let copyCourseCurriculamFormData=[...courseCurriculamFormData];
    const getCurrentSelectedVideoPublicId=copyCourseCurriculamFormData[currentIndex].public_id;
    const response=await mediaDeleteService(getCurrentSelectedVideoPublicId);
    if(response.success){
      copyCourseCurriculamFormData=copyCourseCurriculamFormData.filter((_,index)=>index!==currentIndex)
      setCourseCurriculamFormData(copyCourseCurriculamFormData);
    }
  }
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculam</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadingDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculamFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className=" mt-4 space-y-4">
          {courseCurriculamFormData.map((curriculamItem, index) => (
            <div key={index} className=" border p-5 rounded-md">
              <div className=" flex gap-5 items-center">
                <h3 className=" font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className=" max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculamFormData[index]?.title}
                />
                <div className=" flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(checked) =>
                      handleFreePreviewChange(checked, index)
                    }
                    checked={courseCurriculamFormData[index]?.freePreview}
                    id={`freePreview ${index + 1} `}
                  />
                  <Label htmlFor={`freePreview ${index + 1} `}>
                    {" "}
                    Free Review
                  </Label>
                </div>
              </div>
              <div className=" mt-6">
                {courseCurriculamFormData[index].videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={courseCurriculamFormData[index].videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <Button onClick={() => handleReplaceVideo(index)}>
                      Replace Video
                    </Button>
                    <Button className="bg-red-900" onClick={()=>handleDeleteLecture(index)}>Delete Lecture</Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculam;
