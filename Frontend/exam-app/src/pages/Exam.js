import ExamQuestions from "../components/ExamQuestions";
import { useContext, useEffect, useState } from "react";

import UserContext from "../store/user-context";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "../utils/WebcamCapture";
import TabSwitch from "../utils/TabSwitch";
import FullScreen from "../utils/FullScreen";
import UseWindowDimensions from "../utils/UseWindowDimensions";
import FocusWindow from "../utils/FocusWindow";
import WebSocketDemo from "../utils/WebSocketDemo";
import { get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import WebcamContainer from "../components/WebcamContainer";

function ExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  const [imgUrl, setImgUrl] = useState("");
  const [imgUrl2, setImgUrl2] = useState("");
  const [windowDimensionsFlag, setWindowDimensionsFlag] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [remainingTime, setRemainingTime] = useState({
    hours: null,
    minutes: null,
    seconds: null,
  });
  const [examQuestions, setExamQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [changeAnswerId, setChangeAnswerId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const history = useNavigate();
  useEffect(() => {
    getExamQuestions();
  }, []);

  function dateConverter(date) {
    let year = date.split("/")[2].split(",")[0];
    let month = date.split("/")[0];
    month = month.length === 1 ? "0" + month : month;
    let day = date.split("/")[1];
    day = day.length === 1 ? "0" + day : day;
    let morning = date.split(",")[1].split(" ")[2] === "AM";
    let hour = date.split(" ")[1].split(":")[0];
    hour = morning ? (hour.length === 1 ? "0" + hour : hour) : hour * 1 + 12;
    let minute = date.split(" ")[1].split(":")[1];
    minute = minute.length === 1 ? "0" + minute : minute;
    let second = date.split(" ")[1].split(":")[2];
    second = second.length === 1 ? "0" + second : second;
    let convertedDate =
      year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;
    return convertedDate;
  }

  let getExamQuestions = async () => {
    let current_date = dateConverter(new Date().toLocaleString());
    let response = await get(
      BASEURL + "/main_app/questionlist/" + examId,
      userCtx.authTokens.access
    );
    let data = await response.json();
    console.log(data);
    if (response.status === 200) {
      setExamQuestions(
        data.map((question) => ({
          questionId: question.id,
          questionText: question.question_text,
          questionGrade: question.marks,
          choices: question.choices.map((choice, index) => ({
            id: index + 1,
            text: choice,
          })),
        }))
      );
      setStartTime(current_date);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let finishHandler = () => {
    history("/course");
  };

  let changeAnswerHandler = (questionId, answer) => {
    console.log(questionId, answer);
    setChangeAnswerId(String(questionId) + "-" + String(answer));
    // console.log(questionId, answer);
    setUserAnswers((prevUserAnswers) => {
      let userAnswerIndex = prevUserAnswers.findIndex(
        (userAnswer) => userAnswer.questionId === questionId
      );
      if (userAnswerIndex === -1) {
        return [...prevUserAnswers, { questionId: questionId, answer: answer }];
      } else {
        let newUserAnswers = [...prevUserAnswers];
        newUserAnswers[userAnswerIndex] = {
          questionId: questionId,
          answer: answer,
        };
        return newUserAnswers;
      }
    });
  };

  let imgHandler = (img) => {
    setImgUrl(img);
  };

  let img2Handler = (img) => {
    setImgUrl2(img);
  };

  let changeWindowDimensionsHandler = (changeFlag) => {
    // 0 means window is not maximized
    // 1 means window is maximized
    setWindowDimensionsFlag(changeFlag);
  };

  let changeFocusHandler = (focused) => {
    // false means window is not focused
    // true means window is focused
    setIsFocused(focused);
  };

  let getTime = (remainingTime) => {
    if (remainingTime) {
      let hours = remainingTime.split(":")[0];
      let minutes = remainingTime.split(":")[1];
      let seconds = remainingTime.split(":")[2];
      console.log(hours, ":", minutes, ":", seconds);
      setRemainingTime({
        hours: Number(hours),
        minutes: Number(minutes),
        seconds: Number(seconds),
      });
      console.log(remainingTime);
    }
  };

  return (
    <section>
      {/* <LocalTimer />
      <Timer
        onTimeOut={() => navigate("/exam-details")}
        hours={remainingTime.hours}
        minutes={remainingTime.minutes}
        seconds={remainingTime.seconds}
      /> */}
      <FocusWindow onChangeFocus={changeFocusHandler} />
      <FullScreen />
      <TabSwitch />
      <UseWindowDimensions
        onChangeWindowDimensions={changeWindowDimensionsHandler}
      />
      {/* <FullScreen /> */}
      <div className="container">
      <div className="row">
      <h2 className="col-12">Exam:</h2>
      <div className="col-9">
      <WebSocketDemo
        imgUrl={imgUrl}
        imgUrl2={imgUrl2}
        changeAnswerId={changeAnswerId}
        windowDimensionsFlag={windowDimensionsFlag}
        focus={isFocused}
        updateTimer={getTime}
      />
      <ExamQuestions
        questions={examQuestions}
        editable={true}
        onChangeAnswer={changeAnswerHandler}
      />
      </div>
      <div className="col-3">
        <WebcamContainer
        setImg={imgHandler}
        setImg2={img2Handler}
        facingMode1={userCtx.camera1}
        facingMode2={userCtx.camera2}
      />
      </div>
      <div className="col-12">
        <button onClick={finishHandler}>Finish</button>
      </div>
      </div>
      </div>
      
      {/* <WebcamCapture setImg={imgHandler} facingMode={userCtx.camera1} />
      <WebcamCapture setImg2={img2Handler} facingMode={userCtx.camera2} /> */}
    </section>
  );
}

export default ExamPage;
