import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import CourseInfo from "../components/CourseInfo";
import ExamsComponentsList from "../components/ExamsComponentsList";
import UserContext from "../store/user-context";
import { get, dlt } from "../utils/Fetch";

function CoursePage() {
  const userCtx = useContext(UserContext);
  const courseId = userCtx.courseId;

  let [courseDetails, setCourseDetails] = useState([]);
  let [examsList, setExamsList] = useState([]);
  useEffect(() => {
    userCtx.setExamId(null);
    getCourseDetails();
    getExamsList();
  }, [examsList]);

  let getCourseDetails = async () => {
    let response = await get("http://localhost:8000/main_app/coursedetail/" + courseId, userCtx.authTokens.access)
    let data = await response.json();
    if (response.status === 200) {
      setCourseDetails(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let getExamsList = async () => {
    let response = await get("http://localhost:8000/main_app/examlist/" + courseId, userCtx.authTokens.access);
    let data = await response.json();
    if (response.status === 200) {
      setExamsList(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let deleteExam = (id) => {
    swal({
      title: "Are you sure you want to delete?",
      text: "Once deleted, you will not be able to recover it",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteExamHandler(id);
        swal("Poof! The exam has been deleted!", {
          icon: "success",
        });
      } else {
        swal("The exam is safe!");
      }
    });
  };

  let deleteExamHandler = async (id) => {
    let response = await dlt("http://localhost:8000/main_app/examdelete/" + id, userCtx.authTokens.access);
    if (response.status === 204) {
      setExamsList((prevExamsList) =>
        prevExamsList.filter((exam) => exam.id !== id)
      );
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  return (
    <section>
      <CourseInfo courseData={courseDetails} />
      <ExamsComponentsList
        components={examsList}
        onDelete={deleteExam}
      />
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
