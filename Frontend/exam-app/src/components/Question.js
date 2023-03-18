import classes from "./Question.module.css";
import Choice from "./Choice";

function Question(props) {
  // const correctChoiceIndex = props.choices.findIndex(
  //   (choice) => choice.isCorrect
  // );
  return (
    <div>
      <div>
        <span>
          Grade:{" "}
          {/* {props.studentChoice && (
            <span>
              {props.studentChoice ===
              props.choices[correctChoiceIndex].choiceId
                ? props.questionGrade
                : 0}{" "}
              /{" "}
            </span>
          )} */}
          {props.questionGrade}
        </span>
      </div>
      <div>
        <span>{props.questionText}</span>
      </div>
      <div>
        {
          <Choice
            editable={props.editable}
            key={props.questionId + "1"}
            questionId={props.questionId}
            choice={props.choice1}
            isChecked={props.correctAnswer === 1}
            // onChoiceChange={props.onChoiceChange}
            // isChecked={
            //   props.studentChoice === choice.choiceId ? true : choice.isCorrect
            // }
          />
        }
        {
          <Choice
            editable={props.editable}
            key={props.questionId + "2"}
            questionId={props.questionId}
            choice={props.choice2}
            isChecked={props.correctAnswer === 2}
            // onChoiceChange={props.onChoiceChange}
            // isChecked={
            //   props.studentChoice === choice.choiceId ? true : choice.isCorrect
            // }
          />
        }
        {
          <Choice
            editable={props.editable}
            key={props.questionId + "3"}
            questionId={props.questionId}
            choice={props.choice3}
            isChecked={props.correctAnswer === 3}
            // onChoiceChange={props.onChoiceChange}
            // isChecked={
            //   props.studentChoice === choice.choiceId ? true : choice.isCorrect
            // }
          />
        }
        {
          <Choice
            editable={props.editable}
            key={props.questionId + "4"}
            questionId={props.questionId}
            choice={props.choice4}
            isChecked={props.correctAnswer === 4}
            // onChoiceChange={props.onChoiceChange}
            // isChecked={
            //   props.studentChoice === choice.choiceId ? true : choice.isCorrect
            // }
          />
        }
      </div>
      <div>
        {/* {props.studentChoice && (
          <span>
            The correct answer: {props.choices[correctChoiceIndex].choiceText}
          </span>
        )} */}
      </div>
    </div>
  );
}

export default Question;
