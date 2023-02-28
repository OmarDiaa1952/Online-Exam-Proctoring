import { Link } from "react-router-dom";
import { useContext } from "react";

import ExamInfo from "../components/ExamInfo";
import ExamQuestions from "../components/ExamQuestions";
import CourseContext from "../store/course-context";

function PreviewExamPage() {
  const courseCtx = useContext(CourseContext);
  courseCtx.setNewExamFlag(false);
  
  const DUMMY_DATA1 = {
    startDate: "2021-05-01",
    endDate: "2021-05-31",
    examDuration: "2:00",
    maxGrade: 100,
  };
  
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

  return (
    <section>
      <ExamInfo examData={DUMMY_DATA1} />
      <ExamQuestions questions={DUMMY_DATA2} editable={false} />
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