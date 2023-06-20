import { useEffect, useState, useContext } from "react";
import swal from "sweetalert";

import HomeNavigation from "../components/HomeNavigation";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import MissingVideo from "../components/MissingVideo";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function HomePage() {
  let [courses, setCourses] = useState([]);
  let [foundCourses, setFoundCourses] = useState([]);
  let { authTokens, logoutUser, type, setUserType, setCourseId, setCourseName, setExamId, setExamName } =
    useContext(UserContext);
  let [hasVideo, setHasVideo] = useState(true);
  let [isLoading, setIsLoading] = useState(false);
  let [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    setUserType(localStorage.getItem("userType"));
    if (type === "student") checkVideo();
    getCourses("");
    setCourseId(null);
    setCourseName(null);
    setExamId(null);
    setExamName(null);
    if (type === "student") inspectCourses("");
  }, [type]);

  let getCourses = async (text) => {
    if (loadCount < 2) {
      setIsLoading(true);
      setLoadCount(loadCount + 1);
    }
    let response = await get(
      BASEURL + "/main_app/courselist?search=" + text,
      authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setCourses(data);
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  let inspectCourses = async (text) => {
    if (loadCount < 2) {
      setIsLoading(true);
      setLoadCount(loadCount + 1);
    }
    let response = await get(
      BASEURL + "/main_app/courselist?search=" + text + "&all=1",
      authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setFoundCourses(data);
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  let checkVideo = async () => {
    setIsLoading(true);
    let response = await get(BASEURL + "/users/videoexists", authTokens.access);
    if (response.status === 200) {
      setHasVideo(true);
      setIsLoading(false);
    } else if (response.status === 404) {
      setHasVideo(false);
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div className="container home">
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
        </div>
      )}
    </div>
  );
}

export default HomePage;
