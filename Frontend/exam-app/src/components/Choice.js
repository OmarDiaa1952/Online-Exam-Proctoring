import classes from "./Choice.module.css";

function Choice(props) {
    return (
        <div>
            <input
                type="radio"
                name={props.questionId}
                value={props.choice}
                onChange={() => props.onChoiceChange(props.questionId, props.choice)}
                defaultChecked={props.isChecked}
                disabled={!props.editable}
            />
            <label>{props.choice}</label>
        </div>
    );
}

export default Choice;