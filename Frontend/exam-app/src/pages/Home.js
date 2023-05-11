import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import HomeNavigation from "../components/HomeNavigation";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";
import MissingVideo from "../components/MissingVideo";
import Test from "../utils/Test";

function HomePage() {
  let [courses, setCourses] = useState([]);
  let [foundCourses, setFoundCourses] = useState([]);
  let { authTokens, logoutUser, type, setUserType, setCourseId, setExamId } =
    useContext(UserContext);
  let [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    setUserType(localStorage.getItem("userType"));
    if (type === "student") checkVideo();
    getCourses("");
    setCourseId(null);
    setExamId(null);
    if (type === "student") inspectCourses("");
  }, [type]);

  let getCourses = async (text) => {
    let response = await get(
      "http://localhost:8000/main_app/courselist?search=" + text,
      authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setCourses(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  let inspectCourses = async (text) => {
    let response = await get(
      "http://localhost:8000/main_app/courselist?search=" + text + "&all=1",
      authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setFoundCourses(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  let checkVideo = async () => {
    let response = await get(
      "http://localhost:8000/users/videoexists",
      authTokens.access
    );
    if (response.status === 200) {
      setHasVideo(true);
    } else if (response.status === 404) {
      setHasVideo(false);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <div>
      {/* <Link to="/test">Test Page</Link>
      <Test />
      <Link to="/camera">Camera</Link>
      <br />
      <Link to="/two-camera">Two-Camera</Link>
      <br />
      <Link to="/two-camera-test">Two-Camera-Test</Link> */}
      {!hasVideo && <MissingVideo />}
      {type && (
        <HomeNavigation
          allCourses={foundCourses}
          myCourses={courses}
          onChangeSearchText={getCourses}
          onSearchNewCourses={inspectCourses}
        />
      )}
    </div>
  );
}

export default HomePage;
