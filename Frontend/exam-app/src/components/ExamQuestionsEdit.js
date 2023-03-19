import { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";

import classes from "./ExamQuestionsEdit.module.css";
import UserContext from "../store/user-context";
import QuestionEdit from "./QuestionEdit";

function ExamQuestionsEdit(props) {
  const questionRef = useRef();
  const userCtx = useContext(UserContext);

  const [tempKey, setTempKey] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [editedQuestionsIds, setEditedQuestionsIds] = useState([]);
  const [currentUpdatedQuestionId, setCurrentUpdatedQuestionId] =
    useState(null);
  const [questions, setQuestions] = useState([]);

  const setOldQuestions = () => {
    props.questions.forEach((question) => {
      console.log(question.id);
      setQuestionsData(() => {
        let oldQuestions = [];
        oldQuestions.push({
          questionId: question.id,
          questionText: question.question_text,
          questionGrade: question.marks,
          correctChoice: question.correct_answer,
          choice1: question.choice_1,
          choice2: question.choice_2,
          choice3: question.choice_3,
          choice4: question.choice_4,
        });
        return oldQuestions;
      });
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
    if (
      !editedQuestionsIds.some((id) => id === currentUpdatedQuestionId) &&
      currentUpdatedQuestionId !== null
    ) {
      setEditedQuestionsIds((oldQuestionsIds) => {
        let tempIds = oldQuestionsIds;
        tempIds.push(currentUpdatedQuestionId);
        return tempIds;
      });
    }
  }, [currentUpdatedQuestionId]);

  function editQHandler(questionData, questionNumber) {
    setCurrentUpdatedQuestionId(questionNumber);
    console.log(questionsData);
    setQuestionsData((oldData) =>
      oldData.map((question) => {
        console.log(question.questionId);
        if (question.questionId === questionNumber) {
          return questionData;
        }
        return question;
      })
    );
  }

  const addQuestionHandler = () => {
    setQuestionsData((oldData) => {
      let tempQuestions = oldData;
      tempQuestions.push({
        questionId: tempKey,
        questionText: "",
        questionGrade: 0,
        correctChoice: "1",
        choice1: "",
        choice2: "",
        choice3: "",
        choice4: "",
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
            setCurrentUpdatedQuestionId(null);
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
