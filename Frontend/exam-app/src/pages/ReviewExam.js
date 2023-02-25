import { Link } from "react-router-dom";

import ExamQuestions from "../components/ExamQuestions";

function ReviewExamPage() {
  const DUMMY_DATA = [
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
      studentChoice: "4",
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
      studentChoice: "3",
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
      studentChoice: "4",
    },
  ];

  return (
    <section>
      <h1>Review Exam Page</h1>
      <ExamQuestions questions={DUMMY_DATA} />
      <div>
        <div>
          <Link to="/exam-details">
            <button type="button">Back</button>
          </Link>
        </div>
        <div>
          <Link to="/home">
            <button type="button">Home</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ReviewExamPage;

// This page contains all the questions sections with the answers of
// the student selected and next to each question the grade acquired from the question (e.g.,
// 0/2) with the correct answer displayed for each question,
