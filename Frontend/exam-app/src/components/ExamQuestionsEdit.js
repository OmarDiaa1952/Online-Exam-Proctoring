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
    choices: [],
    correct_answer: 1,
    is_deleted: false,
  };

  const [tempKey, setTempKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [editedQuestionsIds, setEditedQuestionsIds] = useState([]);
  const [currentUpdatedQuestion, setCurrentUpdatedQuestion] =
    useState(DUMMY_QUESTION);
  const [questions, setQuestions] = useState([]);
  const [maxGrade, setMaxGrade] = useState(0);
  const [deleteFlag, setDeleteFlag] = useState(false);

  const setOldQuestions = () => {
    props.questions.forEach((question, index) => {
      setQuestions((oldData) => [
        ...oldData,
        <QuestionEdit
          key={index}
          qNumber={question.id}
          questionText={question.question_text}
          questionGrade={question.marks}
          correctChoice={question.correct_answer}
          newQuestionFlag={false}
          onChoiceChange={(choiceId) => {}}
          choices={question.choices}
          onChangeData={editQHandler}
          onDelete={deleteQHandler}
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
      setTempKey(initialKey + 1);
    }
  };
  useEffect(() => {
    initializeQuestions();
  }, []);

  useEffect(() => {}, [questions]);

  useEffect(() => {
    if (currentIndex < props.questions.length) {
      setQuestionsData((oldData) => [
        ...oldData,
        props.questions[currentIndex],
      ]);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (
      !editedQuestionsIds.some((id) => id === currentUpdatedQuestion.id) &&
      currentUpdatedQuestion.id !== -1
    ) {
      setEditedQuestionsIds((oldQuestionsIds) => {
        let tempIds = oldQuestionsIds;
        tempIds.push(currentUpdatedQuestion.id);
        return tempIds;
      });
    }
    setQuestionsData((oldData) =>
      oldData.map((question) => {
        if (question.id === currentUpdatedQuestion.id) {
          return currentUpdatedQuestion;
        }
        return question;
      })
    );
  }, [currentUpdatedQuestion]);
  useEffect(() => {
    setMaxGrade(questionsData.reduce((acc, question) => acc + question.marks, 0));
  }, [questionsData]);

  useEffect(() => {}, [deleteFlag]);

  function editQHandler(questionData) {
    setCurrentUpdatedQuestion(questionData);
  }

  function deleteQHandler(questionId) {
    setQuestionsData((oldData) =>
      oldData.map((question) => {
        if (question.id === questionId) {
          question.is_deleted = true;
        }
        return question;
      })
    );
    setQuestions((oldData) =>
      oldData.filter((question) => question.props.qNumber !== questionId)
    );
    setDeleteFlag(!deleteFlag);
  }

  const addQuestionHandler = () => {
    setQuestionsData((oldData) => {
      let tempQuestions = oldData;
      tempQuestions.push({
        id: tempKey,
        question_text: "",
        marks: 0,
        correct_answer: 1,
        choices: [{ id: 1, text: "" }, { id: 2, text: "" }, { id: 3, text: "" }, { id: 4, text: "" }],
        is_deleted: false,
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
        newQuestionFlag={true}
        onChoiceChange={(choiceId) => {}}
        choices={[{ id: 1, text: "" }, { id: 2, text: "" }, { id: 3, text: "" }, { id: 4, text: "" }]}
        onChangeData={editQHandler}
        onDelete={deleteQHandler}
        ref={questionRef}
      />,
    ]);
    setTempKey(tempKey + 1);
  };

  return (
    <section>
      <div>
        <label htmlFor="max_grade">Max Grade</label>
        <input
          type="number"
          id="max_grade"
          value={maxGrade}
          readOnly
        />
      </div>
      <h2>Questions:</h2>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // console.log(editedQuestionsIds);
            setEditedQuestionsIds(() => []);
            setCurrentUpdatedQuestion(DUMMY_QUESTION);
            // console.log(questionsData);
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
