import { useState } from "react";

import classes from "./ExamQuestions.module.css";
import Question from "./Question";

function ExamQuestions(props) {
  return (
    <section>
      <h2>Questions:</h2>
      <ol>
        {props.questions.map((question, index) => {
          return (
          <Question
            questionNumber={index + 1}
            editable={props.editable}
            key={question.questionId}
            questionId={question.questionId}
            questionText={question.questionText}
            questionGrade={question.questionGrade}
            correctAnswer={question.correctAnswer}
            choice1={question.choice1}
            choice2={question.choice2}
            choice3={question.choice3}
            choice4={question.choice4}
            choice={question.choice ? question.choice : null}
            onChoiceChange={props.onChangeAnswer}
            // studentChoice={question.studentChoice}
          />
        )})}
      </ol>
    </section>
  );
}

export default ExamQuestions;
