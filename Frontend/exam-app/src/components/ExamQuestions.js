import classes from "./ExamQuestions.module.css";
import Question from "./Question";

function ExamQuestions(props) {
  return (
    <section>
      <h2>Questions:</h2>
      <div>
        {props.questions.map((question) => (
          <Question
            editable={props.editable}
            key={question.id}
            questionId={question.id}
            questionText={question.question_text}
            questionGrade={question.marks}
            correctAnswer={question.correct_answer}
            choice1={question.choice_1}
            choice2={question.choice_2}
            choice3={question.choice_3}
            choice4={question.choice_4}
            // onChoiceChange={props.onChoiceChange}
            // studentChoice={question.studentChoice}
          />
        ))}
      </div>
    </section>
  );
}

export default ExamQuestions;
