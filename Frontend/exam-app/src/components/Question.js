import classes from "./Question.module.css";
import Choice from "./Choice";

function Question(props) {
  const correctChoiceIndex = props.choices.findIndex(
    (choice) => choice.isCorrect
  );
  return (
    <div>
      <div>
        <span>
          Grade:{" "}
          {props.studentChoice && (
            <span>
              {props.studentChoice === props.choices[correctChoiceIndex].choiceId
                ? props.questionGrade
                : 0}{" "}
              /{" "}
            </span>
          )}
          {props.questionGrade}
        </span>
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
            isChecked={
              props.studentChoice === choice.choiceId ? true : choice.isCorrect
            }
          />
        ))}
      </div>
      <div>
        {props.studentChoice && (
          <span>
            The correct answer: {props.choices[correctChoiceIndex].choiceText}
          </span>
        )}
      </div>
    </div>
  );
}

export default Question;
