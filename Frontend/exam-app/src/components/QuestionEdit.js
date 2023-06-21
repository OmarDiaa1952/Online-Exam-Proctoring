import { useState, useRef, forwardRef, useEffect } from "react";

import classes from "./QuestionEdit.module.css";
import ChoiceEdit from "./ChoiceEdit";

const QuestionEdit = forwardRef((props, ref) => {
  const questionTextRef = useRef();
  const questionGradeRef = useRef();

  const [questionText, setQuestionText] = useState("");
  const [questionGrade, setQuestionGrade] = useState(1);
  const [choicesList, setChoicesList] = useState(props.choices);
  const [correctChoice, setCorrectChoice] = useState(props.correctChoice);
  const [choices, setChoices] = useState([]);
  const [newChoiceFlag, setNewChoiceFlag] = useState(false);
  const [deletedChoiceId, setDeletedChoiceId] = useState(-1);
  const [updatedChoice, setUpdatedChoice] = useState(null);

  useEffect(() => {
    setChoices(
      props.choices.map((choice) => (
        <ChoiceEdit
          key={"q" + props.qNumber + "choice" + choice.id}
          choiceId={choice.id}
          choiceText={choice.text}
          questionText={props.questionText}
          questionId={props.qNumber}
          checked={
            props.correctChoice === choice.id
          }
          onChoiceChange={choiceChangeHandler}
          onChange={choicesTextChangeHandler}
          onDeleteChoice={deleteChoiceHandler}
        />
      ))
    );
  }, []);

  useEffect(() => {
    if (newChoiceFlag) {
      setChoices((prevChoices) => [
        ...prevChoices,
        <ChoiceEdit
          key={
            "q" +
            props.qNumber +
            "choice" +
            choicesList[choicesList.length - 1].id
          }
          choiceId={choicesList[choicesList.length - 1].id}
          choiceText={choicesList[choicesList.length - 1].text}
          questionText={props.questionText}
          questionId={props.qNumber}
          checked={false}
          onChoiceChange={choiceChangeHandler}
          onChange={choicesTextChangeHandler}
          onDeleteChoice={deleteChoiceHandler}
        />,
      ]);
      setNewChoiceFlag(false);
    }
  }, [choicesList]);

  useEffect(() => {
    if (deletedChoiceId !== -1) {
      if (choicesList.length !== 2) {
        let updatedQuestion = {
          id: props.qNumber,
          question_text: questionText,
          marks: questionGrade,
          choices: choicesList.filter((choice) => {
            return choice.id !== deletedChoiceId;
          }),
          correct_answer: correctChoice,
        };
        props.onChangeData(updatedQuestion);
        setChoicesList((prevChoices) => {
          return prevChoices.filter((choice) => {
            // console.log(choice.id);
            return choice.id !== deletedChoiceId;
          });
        });
        setChoices((prevChoices) => {
          return prevChoices.filter((choice) => {
            // console.log(choice.props.choiceId);
            return choice.props.choiceId !== deletedChoiceId;
          });
        });
      } else {
        alert("At least 2 choices are required for a question!");
      }
      // choices.forEach((choice) => {
      //   console.log(choice.props.choiceId);
      // });
      // console.log("deletedChoiceId: " + deletedChoiceId);
    }
  }, [deletedChoiceId]);

  useEffect(() => {
    if(updatedChoice !== null) {
      let updatedChoices = choicesList.map((prevChoice) => {
        if (prevChoice.id === updatedChoice.id) {
          return { id: updatedChoice.id, text: updatedChoice.text };
        } else {
          return prevChoice;
        }
      });
      console.log(updatedChoices);
      setChoicesList(updatedChoices);
      setUpdatedChoice(null);
      props.onChangeData({
        id: props.qNumber,
        question_text: questionText,
        marks: Number(questionGrade),
        choices: updatedChoices,
        correct_answer: correctChoice,
      });
    }
  }, [updatedChoice]);

  const questionTextChangeHandler = () => {
    setQuestionText(questionTextRef.current.value);
    console.log(questionTextRef.current.value);
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
    console.log(questionGradeRef.current.value);
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
  };

  useEffect(() => {
    // console.log(props.qNumber);
    // console.log(questionText);
    // console.log(questionGrade);
    // console.log(choicesList);
    props.onChangeData({
      id: props.qNumber,
      question_text: questionText,
      marks: Number(questionGrade),
      choices: choicesList,
      correct_answer: correctChoice,
    });
  }, [correctChoice]);

  const choicesTextChangeHandler = (choiceId, choiceText) => {
    console.log(choiceId, choiceText);
    setUpdatedChoice({ id: choiceId, text: choiceText });
  };

  const deleteQuestionHandler = () => {
    props.onDelete(props.qNumber);
  };

  const addChoiceHandler = () => {
    setChoicesList((prevChoices) => [
      ...prevChoices,
      {
        id:
          choicesList.reduce((max, currentValue) => {
            if (currentValue.id > max) {
              return currentValue.id;
            } else {
              return max;
            }
          }, 0) + 1,
        text: "",
      },
    ]);
    setNewChoiceFlag(true);
  };

  const deleteChoiceHandler = (choiceId) => {
    setDeletedChoiceId(choiceId);
  };

  return (
    <div className="card bg-light mb-5 border border-success">
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
              className="border border-success"
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
              min={1}
              defaultValue={props.questionGrade ? props.questionGrade : 1}
              ref={questionGradeRef}
              onChange={questionGradeChangeHandler}
              className="border border-warning"
            />
          </div>
        </div>
        <div>{choices}</div>
        <div>
          <button type="button" onClick={addChoiceHandler} className="btn btn-outline-success">
            Add Choice
          </button>
        </div>
        <div>
          <button type="button" onClick={deleteQuestionHandler} className="btn btn-secondary">
            Delete Question
          </button>
        </div>
      </li>
    </div>
  );
});

export default QuestionEdit;
