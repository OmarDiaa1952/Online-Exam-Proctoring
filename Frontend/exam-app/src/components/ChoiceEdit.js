import { forwardRef, useRef, useState } from "react"

import classes from "./ChoiceEdit.module.css";

const ChoiceEdit = forwardRef((props, ref) => {
  const choiceTextRef = useRef();

  const choiceTextChangeHandler = () => {
    props.onChange(choiceTextRef.current.value);
  };

  function deleteHandler() {
    props.onDeleteChoice(props.choiceId);
  }

  return (
    <div className="row">
      <div className="col-1">
        <input
          type="radio"
          name={props.questionText ? props.questionText : props.questionId}
          value={props.choiceText}
          onClick={() => props.onChoiceChange(props.choiceId)}
          defaultChecked={props.checked}
        />
        {/* <label>{props.choiceText}</label> */}
      </div>
      <div className="col">
        <textarea
          id={props.choiceId}
          rows="5"
          placeholder="Choice text"
          defaultValue={props.choiceText}
          ref={choiceTextRef}
          onChange={choiceTextChangeHandler}
        />
      </div>
      <div className="col">
        <button type="button" onClick={deleteHandler}>
          Delete
        </button>
      </div>
    </div>
  );
});

export default ChoiceEdit;
