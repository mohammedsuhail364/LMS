import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import RouterGuard from "./components/route-guard";
import InstructorDashboardPage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";

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
      </Route>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  );
}

export default App;
