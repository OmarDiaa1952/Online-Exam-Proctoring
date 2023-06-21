import { forwardRef, useRef, useState } from "react"

import classes from "./ChoiceEdit.module.css";

const ChoiceEdit = forwardRef((props, ref) => {
  const choiceTextRef = useRef();
  // console.log(props);

  const choiceTextChangeHandler = () => {
    props.onChange(props.choiceId, choiceTextRef.current.value);
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
          id={"q" + props.questionId + "choice" + props.choiceId}
          rows="5"
          placeholder="Choice text"
          defaultValue={props.choiceText}
          ref={choiceTextRef}
          onChange={choiceTextChangeHandler}
          className="border border-success"
        />
      </div>
      <div className="col">
        <button type="button" onClick={deleteHandler} className="btn btn-outline-secondary">
          Delete
        </button>
      </div>
    </div>
  );
});

export default ChoiceEdit;
