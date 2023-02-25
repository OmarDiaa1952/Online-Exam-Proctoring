import classes from "./Question.module.css";
import Choice from "./Choice";

function Question(props) {
  return (
    <div>
      <div>
        <span>Grade: {props.questionGrade}</span>
      </div>
      <div>
        <span>{props.questionText}</span>
      </div>
      <div>
        {props.choices.map((choice) => (
          <Choice
            key={choice.choiceId}
            questionId={props.questionId}
            choiceId={choice.choiceId}
            choiceText={choice.choiceText}
            onChoiceChange={props.onChoiceChange}
            isCorrect={choice.isCorrect}
          />
        ))}
      </div>
    </div>
  );
}

export default Question;
