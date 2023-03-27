import { useEffect, useState, useContext } from "react";

import HomeNavigation from "../components/HomeNavigation";
import UserContext from "../store/user-context";

function HomePage() {
  let [courses, setCourses] = useState([]);
  let [foundCourses, setFoundCourses] = useState([]);
  let { authTokens, logoutUser } = useContext(UserContext);
  const userCtx = useContext(UserContext);
  userCtx.setCourseId(null);
  userCtx.setExamId(null);

  useEffect(() => {
    getCourses("");
    if(userCtx.type === "student") inspectCourses("");
  }, []);

  let getCourses = async (text) => {
    let response = await fetch("http://localhost:8000/main_app/courselist?search=" + text, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setCourses(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  let inspectCourses = async (text) => {
    let response = await fetch("http://localhost:8000/main_app/courselist?search=" + text + "&all=1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setFoundCourses(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <div>
      <HomeNavigation
        // enrollmentStatus={enrollmentStatus}
        allCourses={foundCourses}
        myCourses={courses}
        // findEnrollmentStatus={findEnrollmentStatus}
        onChangeSearchText={getCourses}
        onSearchNewCourses={inspectCourses}
      />
    </div>
  );
}

export default HomePage;
