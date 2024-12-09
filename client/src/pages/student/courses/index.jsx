import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filter, setFilter] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate=useNavigate();
  const {auth}=useContext(AuthContext);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let copyFilters = { ...filter };
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      // Add a new section with the current option
      copyFilters[getSectionId] = [getCurrentOption.id];
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1) {
        // Add the option if not already selected
        copyFilters[getSectionId] = [
          ...copyFilters[getSectionId],
          getCurrentOption.id,
        ];
      } else {
        // Remove the option if it is already selected
        copyFilters[getSectionId] = copyFilters[getSectionId].filter(
          (id) => id !== getCurrentOption.id
        );
      }
    }

    // Update the state and session storage
    setFilter(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  }

  async function fetchAllStudentViewCourses(filter, sort) {
    const query = new URLSearchParams({
      ...filter,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response.success) {
      setStudentViewCoursesList(response.data);
      setLoadingState(false);
    }
  }
  function createSearchParamsHelper(filterParams) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    return queryParams.join("&");
  }
  async function handleCourseNavigate(getCurrentCourseId) {
    const response=await checkCoursePurchaseInfoService(getCurrentCourseId,auth.user._id);
    if(response.success){
      if(response.data){
        navigate(`/course-progress/${getCurrentCourseId}`);
      }
      else{
        navigate(`/courses/details/${getCurrentCourseId}`)
      }
    }
  }
  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filter);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filter]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilter(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filter !== null && sort !== null)
      fetchAllStudentViewCourses(filter, sort);
  }, [filter, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);
  // console.log(filter);

  return (
    <div className=" container mx-auto p-4">
      <h1 className=" text-3xl font-bold mb-4">All Courses</h1>
      <div className=" flex flex-col md:flex-row gap-4">
        <aside className=" w-full md:w-64 space-y-4">
          <div >
            {Object.keys(filterOptions).map((keyItem, index) => (
              <div key={index} className=" p-4 border-b">
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className=" grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option, index) => (
                    <Label
                      key={index}
                      className="flex font-medium items-center gap-3"
                    >
                      <Checkbox
                        checked={
                          filter &&
                          Object.keys(filter).length > 0 &&
                          filter[keyItem] &&
                          filter[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}{" "}
          </div>
        </aside>
        <main className=" flex-1">
          <div className=" flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 p-5"
                >
                  <ArrowUpDownIcon className=" h-4 w-4" />
                  <span className=" text-[16px] font-medium gap-2 ">
                    Sort By
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                  }}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className=" text-sm text-black font-bold ">{studentViewCoursesList.length} Results</span>
          </div>
          <div className=" space-y-4">
            {loadingState && <Skeleton />}
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card onClick={()=>handleCourseNavigate(courseItem._id)} key={courseItem._id} className="cursor-pointer">
                  <CardContent className=" flex gap-4 p-4 ">
                    <div className=" w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem.image}
                        className=" w-full h-full object-cover"
                      />
                    </div>
                    <div className=" flex-1">
                      <CardTitle className=" text-xl mb-2">
                        {courseItem.title}
                      </CardTitle>
                      <p className=" text-sm text-gray-600 mb-1">
                        Created By{" "}
                        <span className=" font-bold">
                          {courseItem.instructorName}
                        </span>{" "}
                      </p>
                      <p className=" text-[16px] text-gray-600 mt-3 mb-2">
                        {`${courseItem.curriculam.length} ${
                          courseItem.curriculam.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem.level.toUpperCase()} Level`}
                      </p>
                      <p className=" font-bold text-lg">
                        ${courseItem.pricing}{" "}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className=" font-extrabold  text-4xl">No Courses Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
