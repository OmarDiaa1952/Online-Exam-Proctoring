import classes from "./Question.module.css";
import Choice from "./Choice";

function Question(props) {
  return (
    <li>
      <div className="card bg-info bg-opacity-50 m-3 p-2">
        <div className="d-flex justify-content-between">
          <span>Question{" "}<b>{props.questionNumber}{" "}</b></span>
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
      </div>
      <div className="card bg-light m-3 p-1">
        <div className="card-body">
          <div className="card-title mb-3">
            <p className="h4">{props.questionText}</p>
          </div>
          <div>
            {
              props.choices.map((choice) => {
                return (
                  <Choice
                    id={choice.id}
                    editable={props.editable}
                    key={props.questionId + choice.id}
                    questionId={props.questionId}
                    choice={choice.text}
                    isChecked={
                      props.choice
                        ? props.choice === choice.id
                        : props.correctAnswer === choice.id
                    }
                    onChoiceChange={props.onChoiceChange}
                  // isChecked={
                  //   props.studentChoice === choice.choiceId ? true : choice.isCorrect
                  // }
                  />
                );
              }
              )
            }
          </div>
        </div>
      </div>
      <div>
        {props.choice && <span>The correct answer: {props.choices[props.choice - 1].text}</span>}
      </div>
    </li>
  );
}

export default Question;
