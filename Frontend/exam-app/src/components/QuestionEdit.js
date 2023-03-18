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
        questionId: props.qNumber,
        questionText: questionTextRef.current.value,
        questionGrade: questionGrade,
        choice1: choice1Text,
        choice2: choice2Text,
        choice3: choice3Text,
        choice4: choice4Text,
        correctChoice: correctChoice,
      },
      props.qNumber
    );
  };
  const questionGradeChangeHandler = () => {
    setQuestionGrade(questionGradeRef.current.value);
    props.onChangeData(
      {
        questionId: props.qNumber,
        questionText: questionText,
        questionGrade: questionGradeRef.current.value,
        choice1: choice1Text,
        choice2: choice2Text,
        choice3: choice3Text,
        choice4: choice4Text,
        correctChoice: correctChoice,
      },
      props.qNumber
    );
  };
  const choice1TextChangeHandler = (choiceText) => {
    setChoice1Text(choiceText);
    props.onChangeData(
      {
        questionId: props.qNumber,
        questionText: questionText,
        questionGrade: questionGrade,
        choice1: choiceText,
        choice2: choice2Text,
        choice3: choice3Text,
        choice4: choice4Text,
        correctChoice: correctChoice,
      },
      props.qNumber
    );
  };
  const choice2TextChangeHandler = (choiceText) => {
    setChoice2Text(choiceText);
    props.onChangeData(
      {
        questionId: props.qNumber,
        questionText: questionText,
        questionGrade: questionGrade,
        choice1: choice1Text,
        choice2: choiceText,
        choice3: choice3Text,
        choice4: choice4Text,
        correctChoice: correctChoice,
      },
      props.qNumber
    );
  };
  const choice3TextChangeHandler = (choiceText) => {
    setChoice3Text(choiceText);
    props.onChangeData(
      {
        questionId: props.qNumber,
        questionText: questionText,
        questionGrade: questionGrade,
        choice1: choice1Text,
        choice2: choice2Text,
        choice3: choiceText,
        choice4: choice4Text,
        correctChoice: correctChoice,
      },
      props.qNumber
    );
  };
  const choice4TextChangeHandler = (choiceText) => {
    setChoice4Text(choiceText);
    props.onChangeData(
      {
        questionId: props.qNumber,
        questionText: questionText,
        questionGrade: questionGrade,
        choice1: choice1Text,
        choice2: choice2Text,
        choice3: choice3Text,
        choice4: choiceText,
        correctChoice: correctChoice,
      },
      props.qNumber
    );
  };
  const choiceChangeHandler = (choiceId) => {
    setCorrectChoice(choiceId);
    props.onChangeData(
      {
        questionId: props.qNumber,
        questionText: questionText,
        questionGrade: questionGrade,
        choice1: choice1Text,
        choice2: choice2Text,
        choice3: choice3Text,
        choice4: choice4Text,
        correctChoice: choiceId,
      },
      props.qNumber
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
            questionId={props.questionId}
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
