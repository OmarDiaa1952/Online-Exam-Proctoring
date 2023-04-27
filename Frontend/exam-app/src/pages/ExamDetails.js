import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import ExamInfo from "../components/ExamInfo";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";
import MissingPhoto from "../components/MissingPhoto";

function ExamDetailsPage() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const examId = userCtx.examId;
  let [hasPhoto, setHasPhoto] = useState(true);
  let [examDetails, setExamDetails] = useState([]);
  let [examStatus, setExamStatus] = useState(-1);
  // -1: not started, 0: started, 1: finished

  useEffect(() => {
    if (userCtx.type === "student") checkPhoto();
    getExamDetails();
  }, []);

  let getExamDetails = async () => {
    if (examId) {
      let response = await get(
        "http://localhost:8000/main_app/examdetail/" + examId,
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
        let examStartYear = Number(data.exam_start_date.substring(0, 4));
        let examStartMonth = Number(data.exam_start_date.substring(5, 7));
        let examStartDay = Number(data.exam_start_date.substring(8, 10));
        let examStartHour = Number(data.exam_start_date.substring(11, 13));
        let examStartMinute = Number(data.exam_start_date.substring(14, 16));
        let examEndYear = Number(data.exam_end_date.substring(0, 4));
        let examEndMonth = Number(data.exam_end_date.substring(5, 7));
        let examEndDay = Number(data.exam_end_date.substring(8, 10));
        let examEndHour = Number(data.exam_end_date.substring(11, 13));
        let examEndMinute = Number(data.exam_end_date.substring(14, 16));
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
          currentYear < examStartYear ||
          (currentYear === examStartYear && currentMonth < examStartMonth) ||
          (currentYear === examStartYear &&
            currentMonth === examStartMonth &&
            currentDay < examStartDay) ||
          (currentYear === examStartYear &&
            currentMonth === examStartMonth &&
            currentDay === examStartDay &&
            currentHour < examStartHour) ||
          (currentYear === examStartYear &&
            currentMonth === examStartMonth &&
            currentDay === examStartDay &&
            currentHour === examStartHour &&
            currentMinute < examStartMinute)
        ) {
          setExamStatus(-1);
        } else if (
          currentYear > examEndYear ||
          (currentYear === examEndYear && currentMonth > examEndMonth) ||
          (currentYear === examEndYear &&
            currentMonth === examEndMonth &&
            currentDay > examEndDay) ||
          (currentYear === examEndYear &&
            currentMonth === examEndMonth &&
            currentDay === examEndDay &&
            currentHour > examEndHour) ||
          (currentYear === examEndYear &&
            currentMonth === examEndMonth &&
            currentDay === examEndDay &&
            currentHour === examEndHour &&
            currentMinute > examEndMinute)
        ) {
          setExamStatus(1);
        } else {
          setExamStatus(0);
        }
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let startExamHandler = () => {
    if (examStatus === 0 && hasPhoto && !examDetails.exam_taken) {
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
          navigate("/exam");
          swal("Poof! The exam has started!", {
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
        text: "You can review your exam.",
        icon: "warning",
        buttons: "ok",
      });
    } else if (!hasPhoto) {
      swal({
        title: "You must upload your photo first!",
        text: "You can upload your photo in your profile page.",
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
    let response = await get(
      "http://localhost:8000/users/photoexists",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      if (data.has_photo) {
        setHasPhoto(true);
      } else {
        setHasPhoto(false);
      }
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  return (
    <section>
      {!hasPhoto && <MissingPhoto />}
      <ExamInfo examData={examDetails} />
      <div>
        <button type="button" onClick={startExamHandler}>
          Start Exam
        </button>
      </div>
      <div>
        <button type="button" onClick={reviewExamHandler}>
          Review Exam
        </button>
      </div>
      <div>
        <Link to="/course">
          <button type="button">Back</button>
        </Link>
      </div>
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>
    </section>
  );
}

export default ExamDetailsPage;
