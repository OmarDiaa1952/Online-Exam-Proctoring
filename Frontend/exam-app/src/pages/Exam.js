import ExamQuestions from "../components/ExamQuestions";
import { useContext } from "react";

import UserContext from "../store/user-context";

function ExamPage() {
  const userCtx = useContext(UserContext);
  const DUMMY_DATA = [
    {
      questionId: "1",
      questionText: "What is the capital of France?",
      choices: [
        {
          choiceId: "1",
          choiceText: "Paris",
        },
        {
          choiceId: "2",
          choiceText: "London",
        },
        {
          choiceId: "3",
          choiceText: "Berlin",
        },
        {
          choiceId: "4",
          choiceText: "Rome",
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
        },
        {
          choiceId: "2",
          choiceText: "London",
        },
        {
          choiceId: "3",
          choiceText: "Berlin",
        },
        {
          choiceId: "4",
          choiceText: "Rome",
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
        },
        {
          choiceId: "2",
          choiceText: "London",
        },
        {
          choiceId: "3",
          choiceText: "Berlin",
        },
        {
          choiceId: "4",
          choiceText: "Rome",
        },
      ],
      questionGrade: 10,
    },
  ];

  return (
    <section>
      <h2>Exam:</h2>
      <div>
        <span>Remaining Time: </span>
        <span>01:23:48</span>
      </div>
      <ExamQuestions questions={DUMMY_DATA} editable={true} />
      <div>
        <button>Finish</button>
      </div>
    </section>
  );
}

export default ExamPage;