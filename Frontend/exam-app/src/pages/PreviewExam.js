import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import ExamInfo from "../components/ExamInfo";
import ExamQuestions from "../components/ExamQuestions";
import UserContext from "../store/user-context";

function PreviewExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  let [examDetails, setExamDetails] = useState([]);
  let [examQuestions, setExamQuestions] = useState([]);

  useEffect(() => {
    getExamDetails();
    getExamQuestions();
  }, []);

  let getExamDetails = async () => {
    if (examId) {
      let response = await fetch(
        "http://localhost:8000/main_app/examdetail/" + examId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(userCtx.authTokens.access),
          },
        }
      );
      let data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setExamDetails(data);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };
  let getExamQuestions = async () => {
    if (examId) {
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
      console.log(data);
      if (response.status === 200) {
        setExamQuestions(data);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };
  


  return (
    <section>
      <ExamInfo examData={examDetails} />
      <ExamQuestions questions={examQuestions} editable={false} />
      <div>
        <div>
          <Link to="/log-file">
            <button type="button">View Log File</button>
          </Link>
        </div>
        <div>
          <Link to="/edit-exam">
            <button type="button">Edit</button>
          </Link>
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
      </div>
    </section>
  );
}

export default PreviewExamPage;

const DUMMY_DATA2 = [
  {
    questionId: "1",
    questionText: "What is the capital of France?",
    choices: [
      {
        choiceId: "1",
        choiceText: "Paris",
        isCorrect: true,
      },
      {
        choiceId: "2",
        choiceText: "London",
        isCorrect: false,
      },
      {
        choiceId: "3",
        choiceText: "Berlin",
        isCorrect: false,
      },
      {
        choiceId: "4",
        choiceText: "Rome",
        isCorrect: false,
      },
    ],
    questionGrade: 10,
  },
  {
    questionId: "2",
    questionText: "What is the capital of Germany?",
    choices: [
      {
        choiceId: "1",
        choiceText: "Paris",
        isCorrect: false,
      },
      {
        choiceId: "2",
        choiceText: "London",
        isCorrect: false,
      },
      {
        choiceId: "3",
        choiceText: "Berlin",
        isCorrect: true,
      },
      {
        choiceId: "4",
        choiceText: "Rome",
        isCorrect: false,
      },
    ],
    questionGrade: 10,
  },
  {
    questionId: "3",
    questionText: "What is the capital of Italy?",
    choices: [
      {
        choiceId: "1",
        choiceText: "Paris",
        isCorrect: false,
      },
      {
        choiceId: "2",
        choiceText: "London",
        isCorrect: false,
      },
      {
        choiceId: "3",
        choiceText: "Berlin",
        isCorrect: false,
      },
      {
        choiceId: "4",
        choiceText: "Rome",
        isCorrect: true,
      },
    ],
    questionGrade: 10,
  },
  {
    questionId: "4",
    questionText: "What is the capital of England?",
    choices: [
      {
        choiceId: "1",
        choiceText: "Paris",
        isCorrect: false,
      },
      {
        choiceId: "2",
        choiceText: "London",
        isCorrect: true,
      },
      {
        choiceId: "3",
        choiceText: "Berlin",
        isCorrect: false,
      },
      {
        choiceId: "4",
        choiceText: "Rome",
        isCorrect: false,
      },
    ],
    questionGrade: 10,
  },
  {
    questionId: "5",
    questionText: "What is the capital of Spain?",
    choices: [
      {
        choiceId: "1",
        choiceText: "Paris",
        isCorrect: false,
      },
      {
        choiceId: "2",
        choiceText: "London",
        isCorrect: false,
      },
      {
        choiceId: "3",
        choiceText: "Berlin",
        isCorrect: false,
      },
      {
        choiceId: "4",
        choiceText: "Madrid",
        isCorrect: true,
      },
    ],
    questionGrade: 10,
  },
  {
    questionId: "6",
    questionText: "What is the capital of Greece?",
    choices: [
      {
        choiceId: "1",
        choiceText: "Paris",
        isCorrect: false,
      },
      {
        choiceId: "2",
        choiceText: "London",
        isCorrect: false,
      },
      {
        choiceId: "3",
        choiceText: "Berlin",
        isCorrect: false,
      },
      {
        choiceId: "4",
        choiceText: "Athens",
        isCorrect: true,
      },
    ],
    questionGrade: 10,
  },
  {
    questionId: "7",
    questionText: "What is the capital of Turkey?",
    choices: [
      {
        choiceId: "1",
        choiceText: "Paris",
        isCorrect: false,
      },
      {
        choiceId: "2",
        choiceText: "London",
        isCorrect: false,
      },
      {
        choiceId: "3",
        choiceText: "Berlin",
        isCorrect: false,
      },
      {
        choiceId: "4",
        choiceText: "Ankara",
        isCorrect: true,
      },
    ],
    questionGrade: 10,
  },
];