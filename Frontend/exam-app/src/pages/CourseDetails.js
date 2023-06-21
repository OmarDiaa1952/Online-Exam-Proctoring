import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CourseInfo from "../components/CourseInfo";
import UserContext from "../store/user-context";
import { dlt, get, post } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function CourseDetailsPage() {
  const userCtx = useContext(UserContext);
  let [courseDetails, setCourseDetails] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  const courseId = userCtx.courseId;
  const history = useNavigate();

  useEffect(() => {
    getCourseDetails();
  }, []);

  let getCourseDetails = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/main_app/coursedetail/" + courseId,
      userCtx.authTokens.access
    );
    let data = await response.json();

    if (response.status === 200) {
      if (userCtx.type === "examiner" || data.is_enrolled) history("/course");
      setCourseDetails(data);
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

  let requestCourseHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let response =
      courseDetails.is_requested === false
        ? await post(
            BASEURL + "/main_app/coursejoin/" + courseId,
            {},
            userCtx.authTokens.access
          )
        : await dlt(
            BASEURL + "/main_app/enrollmentrequestdelete/" + courseId,
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
    <section>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div className="general">
            <CourseInfo courseData={courseDetails} />
            {courseDetails.status === "open" && (
              <div>
                <button type="submit" onClick={requestCourseHandler} className="btn btn-success">
                  {courseDetails.is_requested === true
                    ? "Cancel Request"
                    : "Enroll"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CourseDetailsPage;
