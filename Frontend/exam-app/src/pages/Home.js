import { useEffect, useState, useContext } from "react";

import HomeNavigation from "../components/HomeNavigation";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";
import MissingPhoto from "../components/MissingPhoto";

function HomePage() {
  let [courses, setCourses] = useState([]);
  let [foundCourses, setFoundCourses] = useState([]);
  let { authTokens, logoutUser, type, setUserType, setCourseId, setExamId } =
    useContext(UserContext);
  let [hasPhoto, setHasPhoto] = useState(true);

  useEffect(() => {
    setUserType(localStorage.getItem("userType"));
    if(type === "student") checkPhoto();
    getCourses("");
    setCourseId(null);
    setExamId(null);
    if (type === "student") inspectCourses("");
  }, [type]);

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

  let checkPhoto = async () => {
    let response = await get(
      "http://localhost:8000/users/photoexists",
      authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      if (data.has_photo) {
        setHasPhoto(true);
      } else {
        setHasPhoto(false);
      }
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <div>
      {!hasPhoto && <MissingPhoto />}
      {type && <HomeNavigation
        allCourses={foundCourses}
        myCourses={courses}
        onChangeSearchText={getCourses}
        onSearchNewCourses={inspectCourses}
      />}
    </div>
  );
}

export default HomePage;
