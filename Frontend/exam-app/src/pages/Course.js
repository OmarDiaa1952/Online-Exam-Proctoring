import { useContext } from "react";
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
  const DUMMY_DATA1 = {
    courseName: "CSC 309",
    courseId: "CSC309H1F",
    courseDescription: "Introduction to Web Programming",
    examinerName: "Dr. John Doe",
  };
  const DUMMY_DATA2 = [
    {
      id: "e1",
      title: "Exam 1",
    },
    {
      id: "e2",
      title: "Exam 2",
    },
    {
      id: "e3",
      title: "Exam 3",
    },
  ];

  return (
    <section>
      <CourseInfo courseData={DUMMY_DATA1} />
      <ExamsComponentsList components={DUMMY_DATA2} />
      {userCtx.type === "examiner" && (
        <div>
          <div>
            <Link to="/edit-exam">
              <button type="button">Add Exam</button>
            </Link>
          </div>
          <div>
            <Link to="/modify-course">
              <button type="button">Edit</button>
            </Link>
          </div>
        </div>
      )}
      <div>
        <Link to="/home">
          <button type="button">Home</button>
        </Link>
      </div>
    </section>
  );
}

export default CoursePage;