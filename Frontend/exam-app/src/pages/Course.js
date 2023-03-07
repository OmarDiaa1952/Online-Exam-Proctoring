import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CourseInfo from "../components/CourseInfo";
import ExamsComponentsList from "../components/ExamsComponentsList";
import UserContext from "../store/user-context";
import CourseContext from "../store/course-context";

function CoursePage() {
  const userCtx = useContext(UserContext);
  const courseCtx = useContext(CourseContext);
  courseCtx.setNewCourseFlag(false);
  courseCtx.setNewExamFlag(true);
  userCtx.setExamId(null);
  const courseId = userCtx.courseId;

  let [courseDetails, setCourseDetails] = useState([]);
  let [examsList, setExamsList] = useState([]);
  useEffect(() => {
    getCourseDetails();
    getExamsList();
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

  let getExamsList = async () => {
    let response = await fetch(
      "http://localhost:8000/main_app/examlist/" + courseId,
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
      setExamsList(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  return (
    <section>
      <CourseInfo courseData={courseDetails} />
      <ExamsComponentsList components={examsList} />
      {userCtx.type === "examiner" && (
        <div>
          <div>
            <Link to="/edit-exam">
              <button type="button">Add Exam</button>
            </Link>
          </div>
          <div>
            <Link to="/modify-course" state={courseId}>
              <button type="button">Edit</button>
            </Link>
          </div>
        </div>
      )}
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>
    </section>
  );
}

export default CoursePage;
