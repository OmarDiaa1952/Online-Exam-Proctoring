import { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";

import classes from "./ExamQuestionsEdit.module.css";
import UserContext from "../store/user-context";
import QuestionEdit from "./QuestionEdit";

function ExamQuestionsEdit(props) {
  const questionRef = useRef();
  const userCtx = useContext(UserContext);

  const DUMMY_QUESTION = {
    id: -1,
    question_text: "",
    marks: 0,
    choice_1: "",
    choice_2: "",
    choice_3: "",
    choice_4: "",
    correct_answer: "1",
  };

  const [tempKey, setTempKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [editedQuestionsIds, setEditedQuestionsIds] = useState([]);
  const [currentUpdatedQuestion, setCurrentUpdatedQuestion] = useState(DUMMY_QUESTION);
  const [questions, setQuestions] = useState([]);

  const setOldQuestions = () => {
    console.log("setOldQuestions");
    console.log(props.questions);
    props.questions.forEach((question) => {
      setQuestions((oldData) => [
        ...oldData,
        <QuestionEdit
          key={tempKey}
          qNumber={question.id}
          questionText={question.question_text}
          questionGrade={question.marks}
          correctChoice={question.correct_answer}
          onChoiceChange={(choiceId) => {}}
          choice1={question.choice_1}
          choice2={question.choice_2}
          choice3={question.choice_3}
          choice4={question.choice_4}
          onChangeData={editQHandler}
          onSave={props.onSave}
          ref={questionRef}
        />,
      ]);
      setTempKey(tempKey + 1);
    });
  };

  let initialKey = 0;
  const initializeQuestions = () => {
    if (userCtx.examId !== null) {
      setOldQuestions();
      for (let i = 0; i < props.questions.length; i = i + 1) {
        if (props.questions[i].id + 0 > initialKey)
          initialKey = props.questions[i].id;
      }
      setTempKey(initialKey);
    }
  };
  useEffect(() => {
    initializeQuestions();
  }, []);

  useEffect(() => {}, [questions]);

  useEffect(() => {
    // console.log(currentIndex);
    if (currentIndex < props.questions.length) {
      // console.log(props.questions[currentIndex]);
      setQuestionsData((oldData) => [...oldData, props.questions[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
    }
    console.log(questionsData);
  }, [currentIndex]);

  useEffect(() => {
    console.log("useEffect");
    if (
      !editedQuestionsIds.some(
        (id) => id === currentUpdatedQuestion.id
      ) &&
      currentUpdatedQuestion.id !== -1
    ) {
      setEditedQuestionsIds((oldQuestionsIds) => {
        let tempIds = oldQuestionsIds;
        tempIds.push(currentUpdatedQuestion.id);
        return tempIds;
      });
    }
    // console.log(questionsData);
    setQuestionsData((oldData) =>
      oldData.map((question) => {
        // console.log(currentUpdatedQuestion);
        if (question.id === currentUpdatedQuestion.id) {
          return currentUpdatedQuestion;
        }
        return question;
      })
    );
  }, [currentUpdatedQuestion]);

  function editQHandler(questionData) {
    console.log("editQHandler");
    console.log(questionData);
    setCurrentUpdatedQuestion(questionData);
  }

  const addQuestionHandler = () => {
    setQuestionsData((oldData) => {
      let tempQuestions = oldData;
      tempQuestions.push({
        id: tempKey,
        question_text: "",
        marks: 0,
        correct_answer: "1",
        choice_1: "",
        choice_2: "",
        choice_3: "",
        choice_4: "",
      });
      return tempQuestions;
    });

    setQuestions((oldData) => [
      ...oldData,
      <QuestionEdit
        key={tempKey}
        qNumber={tempKey}
        questionText=""
        questionGrade={0}
        correctChoice={1}
        onChoiceChange={(choiceId) => {}}
        choice1=""
        choice2=""
        choice3=""
        choice4=""
        onChangeData={editQHandler}
        onSave={props.onSave}
        ref={questionRef}
      />,
    ]);
    setTempKey(tempKey + 1);
  };

  return (
    <section>
      <h2>Questions:</h2>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(editedQuestionsIds);
            setEditedQuestionsIds(() => []);
            setCurrentUpdatedQuestion(DUMMY_QUESTION);
            console.log(questionsData);
            props.onSave(questionsData, editedQuestionsIds);
          }}
        >
          <ol>{questions}</ol>
          <div>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
      <div>
        <button type="button" onClick={addQuestionHandler}>
          Add Question
        </button>
      </div>
    </section>
  );
}

export default ExamQuestionsEdit;
