import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";

import ModifyCourseDetails from "../components/ModifyCourseDetails";
import StudentAdmission from "../components/StudentAdmission";
import CourseContext from "../store/course-context";

function ModifyCoursePage() {
  const history = useNavigate();
  const courseCtx = useContext(CourseContext);

  const DUMMY_DATA = {
    enrolledStudents: [
      {
        studentEmail: "student1@email.com",
      },
      {
        studentEmail: "student2@email.com",
      },
      {
        studentEmail: "student3@email.com",
      },
    ],
    pendingStudents: [
      {
        studentEmail: "student4@email.com",
      },
      {
        studentEmail: "student5@email.com",
      },
      {
        studentEmail: "student6@email.com",
      },
    ],
  };

  function submitHandler(courseData) {
    fetch(
      "https://react-getting-started-59f1b-default-rtdb.firebaseio.com/newcourses.json",
      {
        method: "POST",
        body: JSON.stringify(courseData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      history("/course");
    });
  }
  function addStudentHandler(studentData) {
    fetch(
      "https://react-getting-started-59f1b-default-rtdb.firebaseio.com/newcourses.json",
      {
        method: "POST",
        body: JSON.stringify(studentData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      console.log("Student added");
    });
  }

  return (
    <section>
      <ModifyCourseDetails onSave={submitHandler} />
      <StudentAdmission studentsData={DUMMY_DATA} onAddStudent={addStudentHandler} />
      <div>
        <Link to={courseCtx.newCourseFlag ? "/home" : "/course"}>
          <button type="button">Back</button>
        </Link>
      </div>
      <div>
        <button>Delete Course</button>
      </div>
    </section>
  );
}

export default ModifyCoursePage;