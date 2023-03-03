import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import CourseInfo from "../components/CourseInfo";
import UserContext from "../store/user-context";

function CourseDetailsPage() {
  let courseRequested = false;
  const userCtx = useContext(UserContext);
  let [courseDetails, setCourseDetails] = useState([]);
  const location = useLocation();
  const { courseId } = location.state;
  const history = useNavigate();

  useEffect(() => {
    getCourseDetails();
  }, []);

  let getCourseDetails = async () => {
    let response = await fetch(
      "http://localhost:8000/main_app/coursedetail/" + courseId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        },
      }
    );
    let data = await response.json();

    if (response.status === 200) {
      setCourseDetails(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let requestCourseHandler = async (e) => {
    e.preventDefault();
    let response = await fetch(
      "http://localhost:8000/main_app/coursejoin/" + courseId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        }
      }
    );
    let data = await response.json();
    if (response.status === 200) {
      courseRequested = true;
      userCtx.setAuthTokens(data);
      userCtx.setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      history("/");
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <section>
      <CourseInfo courseData={courseDetails} />
      <div>
        <button type="submit" onClick={requestCourseHandler}>
          {courseRequested ? "Cancel Request" : "Enroll"}
        </button>
      </div>
      <div>
        <Link to="/">
          <button type="button">Back</button>
        </Link>
      </div>
    </section>
  );
}

export default CourseDetailsPage;
