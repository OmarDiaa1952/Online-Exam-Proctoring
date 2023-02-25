import classes from "./ExamQuestionsEdit.module.css";

import QuestionEdit from "./QuestionEdit";

function ExamQuestionsEdit(props) {
  return (
    <section>
      <h2>Questions:</h2>
      <div>
        {props.questions.map((question) => (
          <QuestionEdit
            key={question.questionId}
            questionId={question.questionId}
            questionText={question.questionText}
            questionGrade={question.questionGrade}
            choices={question.choices}
            onChoiceChange={props.onChoiceChange}
          />
        ))}
      </div>
      <div>
        <button type="button" onClick={props.onAddQuestion}>
          Add Question
        </button>
      </div>
    </section>
  );
}

export default ExamQuestionsEdit;
