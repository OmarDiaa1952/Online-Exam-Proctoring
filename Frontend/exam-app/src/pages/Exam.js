import ExamQuestions from "../components/ExamQuestions";
import { useContext, useEffect, useState } from "react";

import UserContext from "../store/user-context";
import { useNavigate } from "react-router-dom";

function ExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  const [examQuestions, setExamQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState("");
  const history = useNavigate();

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
    let convertedDate = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;
    return convertedDate;
  }

  useEffect(() => {
    getExamQuestions();
  }, []);

  let getExamQuestions = async () => {
    let current_date = dateConverter(new Date().toLocaleString());
    let response = await fetch(
      "http://localhost:8000/main_app/questionlist/" + examId,
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
      setExamQuestions(
        data.map((question) => ({
          questionId: question.id,
          questionText: question.question_text,
          questionGrade: question.question_grade,
          choice1: question.choice_1,
          choice2: question.choice_2,
          choice3: question.choice_3,
          choice4: question.choice_4,
        }))
      );
      setStartTime(current_date);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let finishHandler = async (e) => {
    e.preventDefault();
    // console.log(userAnswers);
    const answers = userAnswers.map((answer) => ({
      question_id: answer.questionId,
      choice: answer.answer,
    }));
    // console.log(answers);
    const submissionTime = dateConverter(new Date().toLocaleString());
    let response = await fetch("http://localhost:8000/main_app/examend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(userCtx.authTokens.access),
      },
      body: JSON.stringify(
        {
          exam_id: userCtx.examId,
          start_time: startTime,
          submission_time: submissionTime,
          answers: answers
        }),
    });
    if (response.status === 200) {
      history("/course");
    } else {
      alert("Something went wrong!");
    }
  };

  let changeAnswerHandler = (questionId, answer) => {
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
  return (
    <section>
      <h2>Exam:</h2>
      <div>
        <span>Remaining Time: </span>
        <span>01:23:48</span>
      </div>
      <ExamQuestions
        questions={examQuestions}
        editable={true}
        onChangeAnswer={changeAnswerHandler}
      />
      <div>
        <button onClick={finishHandler}>Finish</button>
      </div>
    </section>
  );
}

export default ExamPage;
