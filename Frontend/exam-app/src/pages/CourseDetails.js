import { useNavigate } from "react-router-dom";

import EnrollCourse from "../components/EnrollCourse";

function CourseDetailsPage() {
  const history = useNavigate();
  const email = "";
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
