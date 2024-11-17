import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseCurriculam() {
  const { courseCurriculamFormData, setCourseCurriculamFormData } =
    useContext(InstructorContext);
  const { mediaUploadProgress, setMediaUploadProgress } =
    useContext(InstructorContext);

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
        const response = await mediaUploadService(videoFormData);
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
  console.log(courseCurriculamFormData);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course Curriculam</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleNewLecture}>Add Lecture</Button>
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
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(event) => handleSingleLectureUpload(event, index)}
                  className="mb-4"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculam;
