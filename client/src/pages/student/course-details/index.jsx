import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const { id } = useParams();
  const location = useLocation();
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );
    if (response.success) {
      setStudentViewCourseDetails(response.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo.videoUrl);
  }
  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) {
      setShowFreePreviewDialog(true);
    }
  }, [displayCurrentVideoFreePreview]);
  useEffect(() => {
    if (!location.pathname.includes("courses/details"))
      setStudentViewCourseDetails(null), setCurrentCourseDetailsId(null);
  }, []);
  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);
  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);
  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails.curriculam.findIndex(
          (item) => item.freePreview
        )
      : -1;

  if (loadingState) return <Skeleton />;
  return (
    <div className="mx-auto p-4">
      <div className=" bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className=" text-3xl font-bold mb-4">
          {studentViewCourseDetails.title}
        </h1>
        <p className=" text-xl mb-4">{studentViewCourseDetails.subtitle} </p>
        <div className=" flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails.instructorName}</span>
          <span>Created on {studentViewCourseDetails.date.split("T")[0]} </span>
          <span className=" flex items-center">
            <Globe className=" mr-1 h-4 w-4" />
            {studentViewCourseDetails.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails.students.length}{" "}
            {studentViewCourseDetails.students.length <= 1
              ? "Student"
              : "Students"}{" "}
          </span>
        </div>
      </div>
      <div className=" flex flex-col md:flex-row gap-8 mt-8">
        <main className=" flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you{"'"}ll learn </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className=" grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className=" flex items-start">
                      <CheckCircle className=" mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className=" mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails.description}</CardContent>
          </Card>
          <Card className=" mb-8">
            <CardHeader>
              <CardTitle>Course Curriculam</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails.curriculam.map(
                (curriculamItem, index) => (
                  <li
                    key={index}
                    className={`${
                      curriculamItem.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculamItem.freePreview
                        ? () => handleSetFreePreview(curriculamItem)
                        : null
                    }
                  >
                    {curriculamItem.freePreview ? (
                      <PlayCircle className=" mr-2 h-4 w-4" />
                    ) : (
                      <Lock className=" mr-2 h-4 w-4" />
                    )}
                    <span>{curriculamItem.title} </span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className=" w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className=" aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails.curriculam[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className=" mb-4">
                <span className=" text-3xl font-bold ">
                  ${studentViewCourseDetails.pricing}{" "}
                </span>
              </div>
              <Button className="w-full">Buy Now</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className=" aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>
          <div className="flex flex-col">
            {studentViewCourseDetails.curriculam
              .filter((item) => item.freePreview)
              .map((filteredItem, index) =>
                filteredItem.videoUrl === displayCurrentVideoFreePreview ? (
                  <p key={index} className=" cursor-pointer text-[16px] font-medium">{filteredItem.title} </p>
                ) : null
              )}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;