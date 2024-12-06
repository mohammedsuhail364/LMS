import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col h-screen bg-[#1c1d1f] text-white">
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
          <h1></h1>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCourseProgressPage;
