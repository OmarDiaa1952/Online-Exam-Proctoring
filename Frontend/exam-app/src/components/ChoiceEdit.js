import classes from "./ChoiceEdit.module.css";

function ChoiceEdit(props) {
    function deleteHandler() {
        props.onDeleteChoice(props.choiceId);
    }
  return (
    <div>
      <div>
        <input
          type="radio"
          name={props.questionId}
          value={props.choiceId}
          onChange={props.onChoiceChange}
        />
        <label>{props.choiceText}</label>
      </div>
      <div>
        <textarea id="choice-text" rows="5" placeholder="Choice text" />
      </div>
      <div>
        <button type="button" onClick={deleteHandler}>Delete</button>
      </div>
    </div>
  );
}

export default ChoiceEdit;
