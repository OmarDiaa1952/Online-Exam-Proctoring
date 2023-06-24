import ExamQuestions from "../components/ExamQuestions";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import UserContext from "../store/user-context";
import { useNavigate } from "react-router-dom";
import FullScreen from "../utils/FullScreen";
import UseWindowDimensions from "../utils/UseWindowDimensions";
import FocusWindow from "../utils/FocusWindow";
import FaceRecognition from "../utils/FaceRecognition";
import ObjectDetection from "../utils/ObjectDetection";
import WebSocketDemo from "../utils/WebSocketDemo";
import { get } from "../utils/Fetch";
import {
  BASEURL,
  NOT_FOCUSED_WARNING,
  NOT_MAXIMIZED_WARNING,
  FACE_NOT_FOUND_WARNING,
  MORE_THAN_ONE_FACE_WARNING,
  OBJECT_DETECTION_WARNING,
  SPEECH_RECOGNITION_WARNING,
} from "../utils/Consts";
import WebcamContainer from "../components/WebcamContainer";
import LoadingSpinner from "../components/LoadingSpinner";
import useMic from "../hooks/useMic";

function ExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  const navigate = useNavigate();
  const { init, stop } = useMic(onCheating);

  const [imgUrl, setImgUrl] = useState("");
  const [imgUrl2, setImgUrl2] = useState("");
  const [windowDimensionsFlag, setWindowDimensionsFlag] = useState(0);
  const [delayWindowDimensions, setDelayWindowDimensions] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [remainingTime, setRemainingTime] = useState({
    hours: null,
    minutes: null,
    seconds: null,
  });
  const [delayFocus, setDelayFocus] = useState(false);
  const [faceRecognitionFlag, setFaceRecognitionFlag] = useState(false);
  const [faceRecognitionRefresh, setFaceRecognitionRefresh] = useState(false);
  const [delayFaceRecognition, setDelayFaceRecognition] = useState(false);
  const [objectDetectionFlag, setObjectDetectionFlag] = useState(false);
  const [objectDetectionRefresh, setObjectDetectionRefresh] = useState(false);
  const [delayObjectDetection, setDelayObjectDetection] = useState(false);
  const [wordsRecognized, setWordsRecognized] = useState([]);
  const [allowMic, setAllowMic] = useState(false);
  const [warningStates, setWarningStates] = useState({
    focus: { flag: false, timer: 5 },
    windowDimensionsFlag: { flag: false, timer: 5 },
    faceRecognitionFlag: { flag: false, timer: 5 },
    objectDetectionFlag: { flag: false, timer: 5 },
    speechRecognitionFlag: { flag: false, timer: 5 },
  }); // flag: true = warning, false = no warning
  const [warningMsgs, setWarningMsgs] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [timerFlag, setTimerFlag] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examText, setExamText] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [changeAnswerId, setChangeAnswerId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();
  useEffect(() => {
    getExamQuestions();
  }, []);

  useEffect(() => {
    if (!delayFocus) delay(5, setDelayFocus);
  }, [delayFocus]);

  useEffect(() => {
    if (!delayWindowDimensions) delay(3, setDelayWindowDimensions);
  }, [delayWindowDimensions]);

  useEffect(() => {
    if (!delayFaceRecognition) delay(7, setDelayFaceRecognition);
  }, [delayFaceRecognition]);

  useEffect(() => {
    if (!delayObjectDetection) delay(8, setDelayObjectDetection);
  }, [delayObjectDetection]);

  useEffect(() => {
    console.log(wordsRecognized);
  }, [wordsRecognized]);

  useEffect(() => {}, [allowMic]);

  useEffect(() => {
    console.log(examText);
  }, [examText]);

  useEffect(() => {
    if (initialized) {
      let newWarningStates = { ...warningStates };
      let newWarningMsgs = [];
      if (isFocused) {
        newWarningStates.focus.flag = false;
        newWarningStates.focus.timer = 5;
      } else if (!isFocused && warningStates.focus.timer === 0) {
        // navigate("/exam-details");
        console.log("not focused");
      } else {
        newWarningMsgs.push(
          NOT_FOCUSED_WARNING + warningStates.focus.timer + " seconds"
        );
        newWarningStates.focus.flag = true;
        newWarningStates.focus.timer = warningStates.focus.timer - 1;
      }
      if (windowDimensionsFlag === 1) {
        newWarningStates.windowDimensionsFlag.flag = false;
        newWarningStates.windowDimensionsFlag.timer = 5;
      } else if (
        windowDimensionsFlag === 0 &&
        warningStates.windowDimensionsFlag.timer === 0
      ) {
        // navigate("/exam-details");
        console.log("not maximized");
      } else {
        newWarningMsgs.push(
          NOT_MAXIMIZED_WARNING +
            warningStates.windowDimensionsFlag.timer +
            " seconds"
        );
        newWarningStates.windowDimensionsFlag.flag = true;
        newWarningStates.windowDimensionsFlag.timer =
          warningStates.windowDimensionsFlag.timer - 1;
      }
      if (
        faceRecognitionFlag === 1 &&
        warningStates.faceRecognitionFlag.timer > 0
      ) {
        newWarningStates.faceRecognitionFlag.flag = true;
        newWarningStates.faceRecognitionFlag.timer =
          warningMsgs.faceRecognitionFlag.timer - 1;
      } else if (
        faceRecognitionFlag === 1 &&
        warningStates.faceRecognitionFlag.timer === 0
      ) {
        newWarningStates.faceRecognitionFlag.flag = false;
      } else if (faceRecognitionFlag === 0) {
        newWarningStates.faceRecognitionFlag.flag = true;
        newWarningStates.faceRecognitionFlag.timer = 5;
        newWarningMsgs.push(FACE_NOT_FOUND_WARNING);
      } else if (faceRecognitionFlag === 2) {
        newWarningStates.faceRecognitionFlag.flag = true;
        newWarningStates.faceRecognitionFlag.timer = 5;
        newWarningMsgs.push(MORE_THAN_ONE_FACE_WARNING);
      }
      if (
        objectDetectionFlag === "cell phone" ||
        objectDetectionFlag === "book"
      ) {
        newWarningStates.objectDetectionFlag.flag = true;
        newWarningStates.objectDetectionFlag.timer = 5;
        newWarningMsgs.push(OBJECT_DETECTION_WARNING + objectDetectionFlag);
      } else if (warningStates.faceRecognitionFlag.timer === 0) {
        newWarningStates.objectDetectionFlag.flag = false;
      } else {
        newWarningStates.objectDetectionFlag.flag = true;
        newWarningStates.objectDetectionFlag.timer =
          warningStates.objectDetectionFlag.timer - 1;
      }
      if (wordsRecognized.length > 0) {
        newWarningStates.speechRecognitionFlag.flag = true;
        newWarningStates.speechRecognitionFlag.timer = 5;
        newWarningMsgs.push(SPEECH_RECOGNITION_WARNING + wordsRecognized);
      } else if (warningStates.speechRecognitionFlag.timer === 0) {
        newWarningStates.speechRecognitionFlag.flag = false;
      } else {
        newWarningStates.speechRecognitionFlag.flag = true;
        newWarningStates.speechRecognitionFlag.timer =
          warningStates.speechRecognitionFlag.timer - 1;
      }
      setWarningStates(newWarningStates);
      setWarningMsgs(newWarningMsgs);
      delayTimer(1);
    } else {
      setInitialized(true);
      delayTimer(9);
    }
  }, [timerFlag]);

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
    setIsLoading(true);
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
      setExamText(
        data.reduce(
          (acc, question) =>
            acc +
            " " +
            question.question_text +
            " " +
            question.choices.reduce(
              (acc, choice) => acc + " " + choice + " ",
              ""
            ) +
            " ",
          ""
        )
      );
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

  let finishHandler = () => {
    stop();
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

  let changeFaceRecognitionHandler = (flag) => {
    setFaceRecognitionFlag(flag);
  };

  let changeObjectDetectionHandler = (flag) => {
    setObjectDetectionFlag(flag);
  };

  let changeWordsHandler = (words) => {
    setWordsRecognized(words);
  };

  let changeMicHandler = () => {
    setAllowMic(true);
  };

  function onCheating(text) {
    console.log(text);
    let counter = 0;
    let arrChar = text.split("");
    let cheatingWords = "";
    while (counter < arrChar.length) {
      while (counter < arrChar.length && arrChar[counter] !== "[") counter++;
      counter++;
      while (counter < arrChar.length && arrChar[counter] !== "]") {
        cheatingWords += arrChar[counter];
        counter++;
      }
      cheatingWords += " ";
      counter++;
    }
    console.log(cheatingWords);
    if (cheatingWords.length) {
      setWordsRecognized(cheatingWords);
      delay(2).then(() => {
        setWordsRecognized("");
      });
    }
  }

  let updateFaceRecognitionHandler = (flag) => {
    setFaceRecognitionRefresh(flag);
  };

  let updateObjectDetectionHandler = (flag) => {
    setObjectDetectionRefresh(flag);
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

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  let delay = async (seconds, func) => {
    await timeout(1000 * seconds);
    if (func) func(true);
  };

  let delayTimer = async (seconds) => {
    await timeout(1000 * seconds);
    setTimerFlag(!timerFlag);
  };

  return (
    <section className="general">
      {warningMsgs.length > 0 && (
        <div className="card fixed-top">
          {warningMsgs.map((msg) => (
            <p>{msg}</p>
          ))}
        </div>
      )}
      {allowMic ? (
        <div>
          {/* <FullScreen /> */}
          {delayFocus && <FocusWindow onChangeFocus={changeFocusHandler} />}
          {delayWindowDimensions && (
            <UseWindowDimensions
              onChangeWindowDimensions={changeWindowDimensionsHandler}
            />
          )}
          {delayFaceRecognition && (
            <FaceRecognition
              faceRecognitionFlag={faceRecognitionFlag}
              refresh={faceRecognitionRefresh}
            />
          )}
          {delayObjectDetection && (
            <ObjectDetection
              objectDetectionFlag={objectDetectionFlag}
              refresh={objectDetectionRefresh}
            />
          )}
          {warningMsgs > 0 && (
            <div className="card fixed-top">
              {warningMsgs.map((msg) => (
                <p>{msg}</p>
              ))}
            </div>
          )}
          <div className="container">
            <div className="row">
              <div className="col-9">
                {/* <WebSocketDemo
                  imgUrl={imgUrl}
                  imgUrl2={imgUrl2}
                  changeAnswerId={changeAnswerId}
                  windowDimensionsFlag={windowDimensionsFlag}
                  focus={isFocused}
                  updateTimer={getTime}
                  setFaceRecognition={changeFaceRecognitionHandler}
                  setRefreshFaceRecognition={updateFaceRecognitionHandler}
                  setObjectDetection={changeObjectDetectionHandler}
                  setRefreshObjectDetection={updateObjectDetectionHandler}
                /> */}
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <ExamQuestions
                    questions={examQuestions}
                    editable={true}
                    onChangeAnswer={changeAnswerHandler}
                  />
                )}
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
                <button
                  onClick={finishHandler}
                  className="btn btn-success mb-5"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        //allign in the center of the page
        // <div className="d-flex">
        <div className="h-100 d-flex align-items-center justify-content-center flex-column">
          <p className="fs-3">Please enable the mic to load the exam</p>
          <button
            onClick={() => {
              init(examText);
              setAllowMic(true);
            }}
            className="btn btn-secondary"
          >
            Allow Microphone
          </button>
        </div>
        // </div>
      )}
    </section>
  );
}

export default ExamPage;
