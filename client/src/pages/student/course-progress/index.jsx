import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { getCurrentCourseProgressService } from "@/services";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const { id } = useParams();
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth.user._id, id);
    if (!response.data.isPurchased) {
      setLockCourse(true);
    } else {
      setStudentCurrentCourseProgress({
        courseDetails: response.data.courseDetails,
        progress: response.data.progress,
      });
      if (response.data.completed) {
        setCurrentLecture[response.data.courseDetails.curriculam[0]];
        setShowCourseCompleteDialog(true);
        setShowConfetti(true);
        return;
      }
      if (response?.data?.progress.length === 0) {
        setCurrentLecture(response?.data?.courseDetails?.curriculam[0]);
      } else {
        // later
      }
    }
  }
  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);
  console.log(currentLecture);
  
  return (
    <div className=" flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className=" flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700 ">
        <div className=" flex items-center space-x-4">
          <Button
            onClick={() => navigate(`/student-courses`)}
            className="text-black bg-white "
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className=" h-4 w-4" />
            Back to My Courses Page
          </Button>

          <h1 className=" text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className=" h-5 w-5 " />
          ) : (
            <ChevronLeft className=" h-5 w-5 " />
          )}
        </Button>
      </div>
      <div className=" flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            progressData={currentLecture}
            onProgressUpdate={setCurrentLecture}
          />
          <div className=" p-6 bg-[#1c1d1f]">
            <h2 className=" text-2xl font-bold mb-2">
              {currentLecture?.title}
            </h2>
          </div>
        </div>
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className=" h-full flex flex-col">
            <TabsList className="grid bg-white w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className=" text-black rounded-none h-full"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className=" text-black rounded-none h-full"
              >
                OverView
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className=" p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculam.map(
                    (item) => (
                      <div
                        key={item._id}
                        className=" flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                      >
                        <span>{item?.title} </span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className=" p-4">
                  <h2 className=" text-xl font-bold mb-4">About this course</h2>
                  <p className=" text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}{" "}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={lockCourse}>
        <DialogContent className=" sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You Can{"'"}t View this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className=" sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className=" flex flex-col gap-3">
              <Label>You Have Completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button>My Course Page</Button>
                <Button>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
