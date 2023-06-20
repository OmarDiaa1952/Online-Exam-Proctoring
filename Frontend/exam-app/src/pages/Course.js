import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CourseInfo from "../components/CourseInfo";
import ExamsComponentsList from "../components/ExamsComponentsList";
import UserContext from "../store/user-context";
import { get, dlt } from "../utils/Fetch";
import MissingVideo from "../components/MissingVideo";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function CoursePage() {
  const userCtx = useContext(UserContext);
  const courseId = userCtx.courseId;
  const history = useNavigate();

  let [courseDetails, setCourseDetails] = useState([]);
  let [examsList, setExamsList] = useState([]);
  let [updateExamListFlag, setUpdateExamListFlag] = useState(false);
  let [hasVideo, setHasVideo] = useState(true);
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userCtx.setExamId(null);
    userCtx.setExamName(null);
    getCourseDetails();
    getExamsList();
  }, [updateExamListFlag]);

  useEffect(() => {
    if (userCtx.type === "student") checkVideo();
  }, []);

  let getCourseDetails = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/main_app/coursedetail/" + courseId,
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
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

  let getExamsList = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/main_app/examlist/" + courseId,
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setExamsList(data);
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
    setIsLoading(true);
    let response = await dlt(
      BASEURL + "/main_app/examdelete/" + id,
      userCtx.authTokens.access
    );
    if (response.status === 204) {
      setExamsList((prevExamsList) =>
        prevExamsList.filter((exam) => exam.id !== id)
      );
      setUpdateExamListFlag(!updateExamListFlag);
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

  let checkVideo = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/users/videoexists",
      userCtx.authTokens.access
    );
    if (response.status === 200) {
      setHasVideo(true);
      setIsLoading(false);
    } else if (response.status === 404) {
      setHasVideo(false);
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
    setIsLoading(true);
    let response = await dlt(
      BASEURL + "/main_app/courseleave/" + userCtx.courseId,
      userCtx.authTokens.access
    );
    if (response.status === 204) {
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
          <div>
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
          </div>
        </div>
      )}
    </section>
  );
}

export default CoursePage;
