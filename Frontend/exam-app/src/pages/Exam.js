import ExamQuestions from "../components/ExamQuestions";
import { useContext, useEffect, useState } from "react";

import UserContext from "../store/user-context";
import { useNavigate } from "react-router-dom";

function ExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  const [examQuestions, setExamQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    getExamQuestions();
  }, []);

  let getExamQuestions = async () => {
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
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let finishHandler = async (e) => {
    e.preventDefault();
    let response = await fetch("http://localhost:8000/main_app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(userCtx.authTokens.access),
      },
      body: JSON.stringify(userAnswers),
    });
    if (response.status === 201) {
      history("/course");
    } else {
      alert("Something went wrong!");
    }
  };

  let changeAnswerHandler = (questionId, answer) => {
    console.log(questionId, answer);
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
