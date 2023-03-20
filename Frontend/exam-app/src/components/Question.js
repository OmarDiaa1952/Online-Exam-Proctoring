import classes from "./Question.module.css";
import Choice from "./Choice";

function Question(props) {
  let correctChoiceText = "";
  if(props.correctAnswer === "1") correctChoiceText = props.choice1;
  else if(props.correctAnswer === "2") correctChoiceText = props.choice2;
  else if(props.correctAnswer === "3") correctChoiceText = props.choice3;
  else if(props.correctAnswer === "4") correctChoiceText = props.choice4;
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
            isChecked={props.choice ? props.choice === 1 : props.correctAnswer === 1}
            onChoiceChange={props.onChoiceChange}
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
            isChecked={props.choice ? props.choice === 2 : props.correctAnswer === 2}
            onChoiceChange={props.onChoiceChange}
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
            isChecked={props.choice ? props.choice === 3 : props.correctAnswer === 3}
            onChoiceChange={props.onChoiceChange}
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
            isChecked={props.choice ? props.choice === 4 : props.correctAnswer === 4}
            onChoiceChange={props.onChoiceChange}
            // isChecked={
            //   props.studentChoice === choice.choiceId ? true : choice.isCorrect
            // }
          />
        }
      </div>
      <div>
        {props.choice && (
          <span>
            The correct answer: {correctChoiceText}
          </span>
        )}
      </div>
    </div>
  );
}

export default Question;
