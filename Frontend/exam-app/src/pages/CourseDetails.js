import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import EnrollCourse from "../components/EnrollCourse";
import UserContext from "../store/user-context";

function CourseDetailsPage() {
  const userCtx = useContext(UserContext);
  const history = useNavigate();
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
          requestType: "requestCourse",
          courseId: DUMMY_DATA.courseId,
          studentEmail: email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      history("/home");
    });
  }
  return (
    <section>
      <EnrollCourse
        courseData={DUMMY_DATA}
        onRequestCourse={requestCourseHandler}
      />
      <div>
        <button type="button">Back</button>
      </div>
    </section>
  );
}

export default CourseDetailsPage;
