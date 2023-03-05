import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const courseId = location.state;
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
      setCourseDetails(data);
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
