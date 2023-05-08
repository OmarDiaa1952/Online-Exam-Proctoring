import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CourseInfo from "../components/CourseInfo";
import ExamsComponentsList from "../components/ExamsComponentsList";
import UserContext from "../store/user-context";
import { get, dlt } from "../utils/Fetch";
import MissingVideo from "../components/MissingVideo";

function CoursePage() {
  const userCtx = useContext(UserContext);
  const courseId = userCtx.courseId;
  const history = useNavigate();

  let [courseDetails, setCourseDetails] = useState([]);
  let [examsList, setExamsList] = useState([]);
  let [updateExamListFlag, setUpdateExamListFlag] = useState(false);
  let [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    userCtx.setExamId(null);
    getCourseDetails();
    getExamsList();
  }, [updateExamListFlag]);

  useEffect(() => {
    if (userCtx.type === "student") checkVideo();
  }, []);

  let getCourseDetails = async () => {
    let response = await get(
      "http://localhost:8000/main_app/coursedetail/" + courseId,
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setCourseDetails(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let getExamsList = async () => {
    let response = await get(
      "http://localhost:8000/main_app/examlist/" + courseId,
      userCtx.authTokens.access
    );
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
    let response = await dlt(
      "http://localhost:8000/main_app/examdelete/" + id,
      userCtx.authTokens.access
    );
    if (response.status === 204) {
      setExamsList((prevExamsList) =>
        prevExamsList.filter((exam) => exam.id !== id)
      );
      setUpdateExamListFlag(!updateExamListFlag);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let checkVideo = async () => {
    let response = await get(
      "http://localhost:8000/users/videoexists",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      if (data.has_video) {
        setHasVideo(true);
      } else {
        setHasVideo(false);
      }
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let leaveCourse = () => {
    swal({
      title: "Are you sure you want to leave the course?",
      text: "Once you left, you will not be able to access the course contents",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        leaveCourseHandler();
        swal("Poof! You left the course!", {
          icon: "success",
        });
      } else {
        swal("The course is safe!");
      }
    });
  };

  let leaveCourseHandler = async () => {
    let response = await dlt(
      "http://localhost:8000/main_app/courseleave/" + userCtx.courseId,
      userCtx.authTokens.access
    );
    if (response.status === 204) {
      history("/");
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  return (
    <section>
      {!hasVideo && <MissingVideo />}
      <CourseInfo courseData={courseDetails} />
      <ExamsComponentsList components={examsList} onDelete={deleteExam} />
      {userCtx.type === "examiner" ? (
        <div>
          <div>
            <Link to="/edit-exam">
              <button type="button">Add Exam</button>
            </Link>
          </div>
          <div>
            <Link to="/modify-course" state={courseId}>
              <button type="button">Edit Course</button>
            </Link>
          </div>
          <div>
            <Link to="/course-students">
              <button type="button">View Students</button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <button type="button" onClick={leaveCourse}>
            Leave Course
          </button>
        </div>
      )}
      <div className="m-2">
        <hr />
           
      </div>
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>
    </section>
  );
}

export default CoursePage;
