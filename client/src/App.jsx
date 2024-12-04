import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import RouterGuard from "./components/route-guard";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <RouterGuard
            element={<AuthPage />}
            authenticate={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouterGuard
            element={<InstructorDashboardPage />}
            authenticate={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouterGuard
            element={<AddNewCoursePage />}
            authenticate={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouterGuard
            element={<AddNewCoursePage />}
            authenticate={auth.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/"
        element={
          <RouterGuard
            element={<StudentViewCommonLayout />}
            authenticate={auth.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<StudentHomePage/>}/>
        <Route path="home" element={<StudentHomePage/>}/>
        <Route path="courses" element={<StudentViewCoursesPage/>}/>
        <Route path="courses/details/:id" element={<StudentViewCourseDetailsPage/>}/>
        <Route path="payment-return" element={<PaypalPaymentReturnPage/>}/>
        <Route path="student-courses" element={<StudentCoursesPage/>}/>
      </Route>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  );
}

export default App;
