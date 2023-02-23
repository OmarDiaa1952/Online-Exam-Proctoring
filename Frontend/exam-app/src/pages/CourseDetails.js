import { useContext } from "react";
import { Link } from "react-router-dom";

import CourseInfo from "../components/CourseInfo";
import UserContext from "../store/user-context";

function CourseDetailsPage() {
  let courseRequested = false;
  let requestType = "requestCourse";
  if(courseRequested) {
    requestType = "cancelRequestCourse";
  }
  else requestType = "requestCourse";
  const userCtx = useContext(UserContext);
  const email = userCtx.email;
  const DUMMY_DATA = {
    courseId: "CSC1001",
    courseName: "Introduction to Computer Science",
    courseDescription: "This course is an introduction to computer science.",
    examinerName: "Dr. John Doe",
  };
  function requestCourseHandler() {
    fetch(
      "https://react-getting-started-59f1b-default-rtdb.firebaseio.com/courses.json",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: requestType,
          courseId: DUMMY_DATA.courseId,
          studentEmail: email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      console.log("Course requested");
    });
  }
  return (
    <section>
      <CourseInfo
        courseData={DUMMY_DATA}
      />
      <div>
        <button type="submit" onClick={requestCourseHandler}>
          {courseRequested ? "Cancel Request" : "Enroll"}
        </button>
      </div>
      <div>
        <Link to="/home"><button type="button">Back</button></Link>
      </div>
    </section>
  );
}

export default CourseDetailsPage;
