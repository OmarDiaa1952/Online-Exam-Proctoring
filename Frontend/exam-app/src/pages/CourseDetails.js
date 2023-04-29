import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CourseInfo from "../components/CourseInfo";
import UserContext from "../store/user-context";
import { dlt, get, post } from "../utils/Fetch";

function CourseDetailsPage() {
  const userCtx = useContext(UserContext);
  let [courseDetails, setCourseDetails] = useState([]);
  const courseId = userCtx.courseId;
  const history = useNavigate();

  useEffect(() => {
    getCourseDetails();
  }, []);

  let getCourseDetails = async () => {
    let response = await get(
      "http://localhost:8000/main_app/coursedetail/" + courseId,
      userCtx.authTokens.access
    );
    let data = await response.json();

    if (response.status === 200) {
      if (userCtx.type === "examiner" || data.is_enrolled) history("/course");
      setCourseDetails(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let requestCourseHandler = async (e) => {
    e.preventDefault();
    let response =
      courseDetails.is_requested === false
        ? await post(
            "http://localhost:8000/main_app/coursejoin/" + courseId,
            {},
            userCtx.authTokens.access
          )
        : await dlt(
            "http://localhost:8000/main_app/enrollmentrequestdelete/" +
              courseId,
            userCtx.authTokens.access
          );
    // let data = await response.json();
    if (response.status === 201 || response.status === 204) {
      let msg =
        courseDetails.is_requested === true
          ? "has been removed!"
          : "sent successfully!";
      swal({
        title: "Success!",
        text: "Course request " + msg,
        icon: "success",
        button: "OK",
      });
      history("/");
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <section>
      <CourseInfo courseData={courseDetails} />
      {courseDetails.status === "open" && (
        <div>
          <button type="submit" onClick={requestCourseHandler}>
            {courseDetails.is_requested === true ? "Cancel Request" : "Enroll"}
          </button>
        </div>
      )}
      <div>
        <Link to="/">
          <button type="button">Back</button>
        </Link>
      </div>
    </section>
  );
}

export default CourseDetailsPage;
