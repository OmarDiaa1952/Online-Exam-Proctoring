import classes from "./Choice.module.css";

function Choice(props) {
    return (
        <div className="form-check mb-2">
            <input
                className="form-check-input"
                type="radio"
                name={props.questionId}
                value={props.choice}
                onChange={() => props.onChoiceChange(props.questionId, props.id)}
                defaultChecked={props.isChecked}
                disabled={!props.editable}
            />
            <label className="form-check-label">{props.choice}</label>
        </div>
    );
}

export default Choice;