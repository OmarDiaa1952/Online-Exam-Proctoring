import { useState, useRef, forwardRef } from "react";

import classes from "./QuestionEdit.module.css";
import ChoiceEdit from "./ChoiceEdit";

const QuestionEdit = forwardRef((props, ref) => {
  const questionTextRef = useRef();
  const questionGradeRef = useRef();

  const [questionText, setQuestionText] = useState("");
  const [questionGrade, setQuestionGrade] = useState(0);
  const [choicesList, setChoicesList] = useState(props.choices);
  const [correctChoice, setCorrectChoice] = useState(props.correctChoice);

  const questionTextChangeHandler = () => {
    setQuestionText(questionTextRef.current.value);
    props.onChangeData({
      id: props.qNumber,
      question_text: questionTextRef.current.value,
      marks: Number(questionGrade),
      choices: choicesList,
      correct_answer: correctChoice,
    });
  };
  const questionGradeChangeHandler = () => {
    setQuestionGrade(questionGradeRef.current.value);
    props.onChangeData({
      id: props.qNumber,
      question_text: questionText,
      marks: Number(questionGradeRef.current.value),
      choices: choicesList,
      correct_answer: correctChoice,
    });
  };
  const choiceChangeHandler = (choiceId) => {
    setCorrectChoice(choiceId);
    props.onChangeData({
      id: props.qNumber,
      question_text: questionText,
      marks: Number(questionGrade),
      choices: choicesList,
      correct_answer: choiceId,
    });
  };

  const choicesTextChangeHandler = (choiceId, choiceText) => {
    let updatedChoices = choicesList.map((prevChoice) => {
      if (prevChoice.id === choiceId) {
        return { id: choiceId, text: choiceText };
      } else {
        return prevChoice;
      }
    });
    console.log(updatedChoices);
    setChoicesList(updatedChoices);
    props.onChangeData({
      id: props.qNumber,
      question_text: questionText,
      marks: Number(questionGrade),
      choices: updatedChoices,
      correct_answer: correctChoice,
    });
  };

  const deleteQuestionHandler = () => {
    props.onDelete(props.qNumber);
  };

  return (
    <div className="card bg-light mb-5">
      <li key={props.questionText} className="card-body">
        <div className="row">
          <div className="col-6">
            <textarea
              id={"q" + props.qNumber + "questionText"}
              rows="5"
              placeholder="Question text"
              defaultValue={props.questionText}
              ref={questionTextRef}
              onChange={questionTextChangeHandler}
            />
          </div>
          <label
            htmlFor={"q" + props.qNumber + "questionGrade"}
            className="col"
          >
            Grade:
          </label>
          <div className="col">
            <input
              id={"q" + props.qNumber + "questionGrade"}
              type="number"
              defaultValue={props.questionGrade}
              ref={questionGradeRef}
              onChange={questionGradeChangeHandler}
            />
          </div>
        </div>
        <div>
          {props.choices.map((choice) => (
            <ChoiceEdit
              key={"q" + props.qNumber + "choice" + choice.id}
              choiceId={choice.id}
              choiceText={choice.text}
              questionText={props.questionText}
              questionId={props.qNumber}
              checked={
                props.newQuestionFlag
                  ? false
                  : props.correctChoice === choice.id
              }
              onChoiceChange={choiceChangeHandler}
              onChange={choicesTextChangeHandler}
            />
          ))}
        </div>
        <div>
          <button type="button" onClick={props.onAddChoice}>
            Add Choice
          </button>
        </div>
        <div>
          <button type="button" onClick={deleteQuestionHandler}>
            Delete Question
          </button>
        </div>
      </li>
    </div>
  );
});

export default QuestionEdit;
