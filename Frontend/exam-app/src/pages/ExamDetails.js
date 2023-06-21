import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import ExamInfo from "../components/ExamInfo";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import MissingVideo from "../components/MissingVideo";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function ExamDetailsPage() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const examId = userCtx.examId;
  let [hasVideo, setHasVideo] = useState(true);
  let [hasPhoto, setHasPhoto] = useState(false);
  let [examDetails, setExamDetails] = useState([]);
  let [examStatus, setExamStatus] = useState(-1);
  let [isLoading, setIsLoading] = useState(false);
  // -1: not started, 0: started, 1: finished

  useEffect(() => {
    if (userCtx.type === "student") {
      checkVideo();
      checkPhoto();
    }
    getExamDetails();
  }, []);

  let getExamDetails = async () => {
    if (examId) {
      setIsLoading(true);
      let response = await get(
        BASEURL + "/main_app/examdetail/" + examId,
        userCtx.authTokens.access
      );
      let data = await response.json();

      let currentTime = new Date();
      let currentYear = currentTime.getFullYear();
      let currentMonth = currentTime.getMonth() + 1;
      let currentDay = currentTime.getDate();
      let currentHour = currentTime.getHours();
      let currentMinute = currentTime.getMinutes();
      if (response.status === 200) {
        let examStartYear = data.exam_start_date.substring(0, 4);
        let examStartMonth = data.exam_start_date.substring(5, 7);
        let examStartDay = data.exam_start_date.substring(8, 10);
        let examStartHour = data.exam_start_date.substring(11, 13);
        let examStartMinute = data.exam_start_date.substring(14, 16);
        let examEndYear = data.exam_end_date.substring(0, 4);
        let examEndMonth = data.exam_end_date.substring(5, 7);
        let examEndDay = data.exam_end_date.substring(8, 10);
        let examEndHour = data.exam_end_date.substring(11, 13);
        let examEndMinute = data.exam_end_date.substring(14, 16);
        const examDate = {
          exam_start_year: examStartYear,
          exam_start_month: examStartMonth,
          exam_start_day: examStartDay,
          exam_start_hour: examStartHour,
          exam_start_minute: examStartMinute,
          exam_end_year: examEndYear,
          exam_end_month: examEndMonth,
          exam_end_day: examEndDay,
          exam_end_hour: examEndHour,
          exam_end_minute: examEndMinute,
        };
        setExamDetails({ ...data, ...examDate });
        if (
          currentYear < Number(examStartYear) ||
          (currentYear === Number(examStartYear) &&
            currentMonth < Number(examStartMonth)) ||
          (currentYear === Number(examStartYear) &&
            currentMonth === Number(examStartMonth) &&
            currentDay < Number(examStartDay)) ||
          (currentYear === Number(examStartYear) &&
            currentMonth === Number(examStartMonth) &&
            currentDay === Number(examStartDay) &&
            currentHour < Number(examStartHour)) ||
          (currentYear === Number(examStartYear) &&
            currentMonth === Number(examStartMonth) &&
            currentDay === Number(examStartDay) &&
            currentHour === Number(examStartHour) &&
            currentMinute < Number(examStartMinute))
        ) {
          setExamStatus(-1);
        } else if (
          currentYear > Number(examEndYear) ||
          (currentYear === Number(examEndYear) &&
            currentMonth > Number(examEndMonth)) ||
          (currentYear === Number(examEndYear) &&
            currentMonth === Number(examEndMonth) &&
            currentDay > Number(examEndDay)) ||
          (currentYear === Number(examEndYear) &&
            currentMonth === Number(examEndMonth) &&
            currentDay === Number(examEndDay) &&
            currentHour > Number(examEndHour)) ||
          (currentYear === Number(examEndYear) &&
            currentMonth === Number(examEndMonth) &&
            currentDay === Number(examEndDay) &&
            currentHour === Number(examEndHour) &&
            currentMinute > Number(examEndMinute))
        ) {
          setExamStatus(1);
          setIsLoading(false);
        } else {
          setExamStatus(0);
          setIsLoading(false);
        }
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    }
  };

  let startExamHandler = () => {
    if (
      examStatus === 0 &&
      !examDetails.exam_taken &&
      window.screen.availWidth === window.outerWidth &&
      window.screen.availHeight === window.outerHeight &&
      hasVideo && hasPhoto
    ) {
      swal({
        title: "Are you sure you want to start the exam?",
        text: "Note: You have only one attempt.\nYou are not allowed to switch to other tabs nor to open other apps nor other windows.\nYou must keep the window maximzed.\nOtherwise the exam will be instantly ended.\nYou must allow the camera to be used\nYou should keep away from any trials of cheating.\nAny cheating trial will be recorded to the instructor\nBest wishes!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willStart) => {
        if (willStart) {
          navigator.getUserMedia(
            { audio: true, video: true },
            function (stream) {
              stream.getTracks().forEach((x) => x.stop());
            },
            (err) => console.log(err)
          );
          navigate("/face-detection");
          swal("One moment before you start the exam...", {
            icon: "success",
          });
        } else {
          swal(
            "Cancelled! Make sure you start the exam before the exam date expires"
          );
        }
      });
    } else if (examDetails.exam_taken) {
      swal({
        title: "You have already taken the exam!",
        text: "You can review your exam when the end date expires.",
        icon: "warning",
        buttons: "ok",
      });
    } else if (examStatus === 1) {
      swal({
        title: "Exam date has already expired!",
        text: "You can review your exam.",
        icon: "warning",
        buttons: "ok",
      });
    } else if (!hasPhoto) {
      swal({
        title: "Photo not avaiable!",
        text: "You can't start the exam unless you have set your profile picture.",
        icon: "warning",
        buttons: "ok",
      });
    } else if (!hasVideo) {
      swal({
        title: "Video not avaiable!",
        text: "You can't start the exam unless you have a recorded video.",
        icon: "warning",
        buttons: "ok",
      });
    } else if (
      window.screen.availWidth !== window.outerWidth ||
      window.screen.availHeight !== window.outerHeight
    ) {
      swal({
        title: "You must keep the window maximized!",
        text: "You can't start the exam unless you keep the window maximized (And also not in fullscreen mode, You will be automatically moved to fullscreen mode when you start the exam).",
        icon: "warning",
        buttons: "ok",
      });
    } else {
      swal({
        title: "Exam is not available yet!",
        text: "You can start your exam when the exam date starts.",
        icon: "warning",
        buttons: "ok",
      });
    }
  };

  let reviewExamHandler = () => {
    if (examStatus === 1) {
      navigate("/review-exam");
    } else {
      swal({
        title: "Exam review is not allowed!",
        text: "You can review your exam when the exam date expires.",
        icon: "warning",
        buttons: "ok",
      });
    }
  };

  let checkPhoto = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/users/photoexists",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      if (data.has_photo) {
        setHasPhoto(true);
      } else {
        setHasPhoto(false);
      }
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
    setIsLoading(false);
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

  return (
    <section>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          {!hasVideo && <MissingVideo />}
          <div className="general">
            <ExamInfo examData={examDetails} />
            <div>
              <button
                type="button"
                onClick={startExamHandler}
                className="btn btn-outline-warning"
              >
                Start Exam
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={reviewExamHandler}
                className="btn btn-secondary"
              >
                Review Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ExamDetailsPage;
