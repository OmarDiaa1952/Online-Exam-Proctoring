import classes from "./QuestionEdit.module.css";

import ChoiceEdit from "./ChoiceEdit";

function QuestionEdit(props) {
  return (
    <div>
      <div>
        <textarea
          id="choice-text"
          rows="5"
          placeholder="Question text"
          onChange={props.onQuestionTextChange}
        />
      </div>
      <label htmlFor="grade">Grade:</label>
      <input
        id="grade"
        type="number"
        value={props.questionGrade}
        onChange={props.onQuestionGradeChange}
      />
      <div>
        {props.choices.map((choice) => (
          <ChoiceEdit
            key={choice.choiceId}
            choiceId={choice.choiceId}
            choiceText={choice.choiceText}
            questionId={props.questionId}
            onChoiceChange={props.onChoiceChange}
          />
        ))}
      </div>
      <div>
        <button type="button" onClick={props.onAddChoice}>
          Add Choice
        </button>
      </div>
      <div>
        <button type="button" onClick={props.onDeleteQuestion}>
          Delete Question
        </button>
      </div>
    </div>
  );
}

export default QuestionEdit;
