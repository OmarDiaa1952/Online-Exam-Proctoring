import { useEffect, useState, useContext } from "react";

import HomeNavigation from "../components/HomeNavigation";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";

function HomePage() {
  let [courses, setCourses] = useState([]);
  let [foundCourses, setFoundCourses] = useState([]);
  let { authTokens, logoutUser, type, setCourseId, setExamId } =
    useContext(UserContext);

  useEffect(() => {
    getCourses("");
    setCourseId(null);
    setExamId(null);
    if (type === "student") inspectCourses("");
  }, []);

  let getCourses = async (text) => {
    let response = await get("http://localhost:8000/main_app/courselist?search=" + text, authTokens.access);
    let data = await response.json();
    if (response.status === 200) {
      setCourses(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  let inspectCourses = async (text) => {
    let response = await get("http://localhost:8000/main_app/courselist?search=" + text + "&all=1", authTokens.access);
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
        allCourses={foundCourses}
        myCourses={courses}
        onChangeSearchText={getCourses}
        onSearchNewCourses={inspectCourses}
      />
    </div>
  );
}

export default HomePage;
