import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import classes from "./ExamQuestionsEdit.module.css";
import QuestionEdit from "./QuestionEdit";

function ExamQuestionsEdit(props) {
  const questionRef = useRef();

  const [tempKey, setTempKey] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [editedQuestionsIds, setEditedQuestionsIds] = useState([]);
  const [currentUpdatedQuestionId, setCurrentUpdatedQuestionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {}, [questions]);
  useEffect(() => {
    if (!editedQuestionsIds.some((id) => id === currentUpdatedQuestionId) && currentUpdatedQuestionId !== null) {
      setEditedQuestionsIds((oldQuestionsIds) => {
        let tempIds = oldQuestionsIds;
        tempIds.push(currentUpdatedQuestionId);
        return tempIds;
      });
    }
  }, [currentUpdatedQuestionId]);

  function editQHandler(questionData, questionNumber) {
    setCurrentUpdatedQuestionId(questionNumber);
    setQuestionsData((oldData) =>
      oldData.map((question) => {
        if (question.questionId === questionNumber) {
          return questionData;
        }
        return question;
      })
    );
  };

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
            props.onSave(questionsData, editedQuestionsIds)
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
