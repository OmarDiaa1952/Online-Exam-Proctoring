import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CourseInfo from "../components/CourseInfo";
import UserContext from "../store/user-context";

function CourseDetailsPage() {
  let courseRequested = false;
  const userCtx = useContext(UserContext);
  let [courseDetails, setCourseDetails] = useState([]);
  const courseId = userCtx.courseId;
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
    if (response.status === 201) {
      courseRequested = true;
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
