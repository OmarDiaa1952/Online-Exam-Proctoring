import {
  useState,
  useRef,
  forwardRef,
} from "react";

import classes from "./QuestionEdit.module.css";
import ChoiceEdit from "./ChoiceEdit";

const QuestionEdit = forwardRef((props, ref) => {
  const questionTextRef = useRef();
  const questionGradeRef = useRef();

  const [questionText, setQuestionText] = useState("");
  const [questionGrade, setQuestionGrade] = useState(0);
  const [choice1Text, setChoice1Text] = useState("");
  const [choice2Text, setChoice2Text] = useState("");
  const [choice3Text, setChoice3Text] = useState("");
  const [choice4Text, setChoice4Text] = useState("");
  const [correctChoice, setCorrectChoice] = useState("1");

  const questionTextChangeHandler = () => {
    setQuestionText(questionTextRef.current.value);
    props.onChangeData(
      {
        id: props.qNumber,
        question_text: questionTextRef.current.value,
        marks: Number(questionGrade),
        choice_1: choice1Text,
        choice_2: choice2Text,
        choice_3: choice3Text,
        choice_4: choice4Text,
        correct_answer: correctChoice,
      }
    );
  };
  const questionGradeChangeHandler = () => {
    setQuestionGrade(questionGradeRef.current.value);
    props.onChangeData(
      {
        id: props.qNumber,
        question_text: questionText,
        marks: Number(questionGradeRef.current.value),
        choice_1: choice1Text,
        choice_2: choice2Text,
        choice_3: choice3Text,
        choice_4: choice4Text,
        correct_answer: correctChoice,
      }
    );
  };
  const choice1TextChangeHandler = (choiceText) => {
    setChoice1Text(choiceText);
    props.onChangeData(
      {
        id: props.qNumber,
        question_text: questionText,
        marks: Number(questionGrade),
        choice_1: choiceText,
        choice_2: choice2Text,
        choice_3: choice3Text,
        choice_4: choice4Text,
        correct_answer: correctChoice,
      }
    );
  };
  const choice2TextChangeHandler = (choiceText) => {
    setChoice2Text(choiceText);
    props.onChangeData(
      {
        id: props.qNumber,
        question_text: questionText,
        marks: Number(questionGrade),
        choice_1: choice1Text,
        choice_2: choiceText,
        choice_3: choice3Text,
        choice_4: choice4Text,
        correct_answer: correctChoice,
      }
    );
  };
  const choice3TextChangeHandler = (choiceText) => {
    setChoice3Text(choiceText);
    props.onChangeData(
      {
        id: props.qNumber,
        question_text: questionText,
        marks: Number(questionGrade),
        choice_1: choice1Text,
        choice_2: choice2Text,
        choice_3: choiceText,
        choice_4: choice4Text,
        correct_answer: correctChoice,
      }
    );
  };
  const choice4TextChangeHandler = (choiceText) => {
    setChoice4Text(choiceText);
    props.onChangeData(
      {
        id: props.qNumber,
        question_text: questionText,
        marks: Number(questionGrade),
        choice_1: choice1Text,
        choice_2: choice2Text,
        choice_3: choice3Text,
        choice_4: choiceText,
        correct_answer: correctChoice,
      }
    );
  };
  const choiceChangeHandler = (choiceId) => {
    setCorrectChoice(choiceId);
    props.onChangeData(
      {
        id: props.qNumber,
        question_text: questionText,
        marks: Number(questionGrade),
        choice_1: choice1Text,
        choice_2: choice2Text,
        choice_3: choice3Text,
        choice_4: choice4Text,
        correct_answer: choiceId,
      }
    );
  };

  return (
    <li key={props.questionText}>
      <div>
        <textarea
          id={"q" + props.qNumber + "questionText"}
          // id={"questionText"}
          rows="5"
          placeholder="Question text"
          defaultValue={props.questionText}
          ref={questionTextRef}
          onChange={questionTextChangeHandler}
          />
      </div>
      <label htmlFor={"q" + props.qNumber + "questionGrade"}>Grade:</label>
      <input
        id={"q" + props.qNumber + "questionGrade"}
        // id={"questionGrade"}
        type="number"
        defaultValue={props.questionGrade}
        ref={questionGradeRef}
        onChange={questionGradeChangeHandler}
      />
      <div>
        {/* {props.choices.map((choice) => (
          <ChoiceEdit
            key={choice.choiceId}
            choiceId={choice.choiceId}
            choiceText={choice.choiceText}
            id={props.id}
            onChoiceChange={props.onChoiceChange}
          />
        ))} */}
        <ChoiceEdit
          key={"q" + props.qNumber + "choice1"}
          choiceId={"1"}
          // key={"choice1"}
          // choiceId={"choice1"}
          choiceText={props.choice1}
          questionText={props.questionText}
          onChoiceChange={choiceChangeHandler}
          onChange={choice1TextChangeHandler}
        />
        <ChoiceEdit
          key={"q" + props.qNumber + "choice2"}
          choiceId={"2"}
          // key={"choice2"}
          // choiceId={"choice2"}
          choiceText={props.choice2}
          questionText={props.questionText}
          onChoiceChange={choiceChangeHandler}
          onChange={choice2TextChangeHandler}
        />
        <ChoiceEdit
          key={"q" + props.qNumber + "choice3"}
          choiceId={"3"}
          // key={"choice3"}
          // choiceId={"choice3"}
          choiceText={props.choice3}
          questionText={props.questionText}
          onChoiceChange={choiceChangeHandler}
          onChange={choice3TextChangeHandler}
        />
        <ChoiceEdit
          key={"q" + props.qNumber + "choice4"}
          choiceId={"4"}
          // key={"choice4"}
          // choiceId={"choice4"}
          choiceText={props.choice4}
          questionText={props.questionText}
          onChoiceChange={choiceChangeHandler}
          onChange={choice4TextChangeHandler}
        />
      </div>
      <div>
        <button type="button" onClick={props.onAddChoice}>
          Add Choice
        </button>
      </div>
      <div>
        <button type="button" onClick={props.onDeleteQuestion}>
          Delete Question
        </button>
      </div>
    </li>
  );
});

export default QuestionEdit;
