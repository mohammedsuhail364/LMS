import CourseCurriculam from "@/components/instructor-view/courses/add-new-courses/course-curriculam";
import CourseLanding from "@/components/instructor-view/courses/add-new-courses/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-courses/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const navigate = useNavigate();
  const {
    courseLandingFormData,
    courseCurriculamFormData,
    setCourseLandingFormData,
    setCourseCurriculamFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);
  const params = useParams();
  const { auth } = useContext(AuthContext);
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }
  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }
    let hasFreePreview = false;
    for (const item of courseCurriculamFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasFreePreview = true;
      }
    }
    return hasFreePreview;
  }
  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth.user._id,
      instructorName: auth.user.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculam: [...courseCurriculamFormData],
      isPublished: true,
    };
    // console.log("eywigshdfb", courseFinalFormData);
    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
            currentEditedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData);
    if (response.success) {
      setCourseLandingFormData(courseLandingFormData);
      setCourseCurriculamFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }
  }
  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );
    if (response.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});
      // console.log(response);

      // console.log("hsgw",setCourseFormData);
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculamFormData(response.data.curriculam);
    }
  }
  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);
  // console.log(params);
  useEffect(() => {
    if (params.courseId) setCurrentEditedCourseId(params.courseId);
  }, [params.courseId, setCurrentEditedCourseId]);

  return (
    <div className=" container mx-auto p-4">
      <div className=" flex justify-between">
        <h1 className=" text-3xl font-extrabold mb-5">Create A New Course</h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className=" container mx-auto p-4">
            <Tabs className=" space-y-4" defaultValue="curriculam">
              <TabsList>
                <TabsTrigger value="curriculam">Curriculam</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculam">
                <CourseCurriculam />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
