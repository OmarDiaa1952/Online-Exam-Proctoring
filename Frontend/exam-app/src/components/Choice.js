import classes from "./Choice.module.css";

function Choice(props) {
    return (
        <div>
            <input
                type="radio"
                name={props.questionId}
                value={props.choiceId}
                onChange={props.onChoiceChange}
                defaultChecked={props.isCorrect}
                disabled
            />
            <label>{props.choiceText}</label>
        </div>
    );
}

export default Choice;