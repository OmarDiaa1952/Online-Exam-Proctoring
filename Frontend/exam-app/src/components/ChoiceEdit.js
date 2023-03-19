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
    <div>
      <div>
        <input
          type="radio"
          name={props.questionText}
          value={props.choiceText}
          onClick={() => props.onChoiceChange(props.choiceId)}
        />
        {/* <label>{props.choiceText}</label> */}
      </div>
      <div>
        <textarea
          id={props.choiceId}
          rows="5"
          placeholder="Choice text"
          defaultValue={props.choiceText}
          ref={choiceTextRef}
          onChange={choiceTextChangeHandler}
        />
      </div>
      <div>
        <button type="button" onClick={deleteHandler}>
          Delete
        </button>
      </div>
    </div>
  );
});

export default ChoiceEdit;
