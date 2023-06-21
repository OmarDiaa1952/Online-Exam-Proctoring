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
    marks: 1,
    choices: [],
    correct_answer: 1,
    is_deleted: false,
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [editedQuestionsIds, setEditedQuestionsIds] = useState([]);
  const [currentUpdatedQuestion, setCurrentUpdatedQuestion] =
    useState(DUMMY_QUESTION);
  const [questions, setQuestions] = useState([]);
  const [newQuestionFlag, setNewQuestionFlag] = useState(false);
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
    // console.log("currentUpdatedQuestion", currentUpdatedQuestion);
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
    setMaxGrade(
      questionsData.reduce((acc, question) => acc + question.marks, 0)
    );
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
    const tempKey =
      questionsData.reduce(
        (maxId, question) => {
          if (question.id > maxId) {
            return question.id;
          }
          return maxId;
        },
        questionsData.length > 0 ? questionsData[0].id : 1
      ) + 1;
    setQuestionsData((oldData) => {
      let tempQuestions = oldData;
      tempQuestions.push({
        id: tempKey,
        question_text: "",
        marks: 1,
        correct_answer: 1,
        choices: [
          { id: 1, text: "" },
          { id: 2, text: "" },
        ],
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
        questionGrade={1}
        correctChoice={1}
        newQuestionFlag={true}
        onChoiceChange={(choiceId) => {}}
        choices={[
          { id: 1, text: "" },
          { id: 2, text: "" },
        ]}
        onChangeData={editQHandler}
        onDelete={deleteQHandler}
        ref={questionRef}
      />,
    ]);
  };
  // useEffect(() => {
  //   if (newQuestionFlag) {
  //     const tempKey = questionsData.reduce((maxId, question) => {
  //       if (question.id > maxId) {
  //         return question.id;
  //         }
  //         return maxId;
  //         }, questionsData.length > 0 ? questionsData[0].id : 1) + 1;
  //     setQuestionsData((oldData) => {
  //       let tempQuestions = oldData;
  //       tempQuestions.push({
  //         id: tempKey,
  //         question_text: "",
  //         marks: 1,
  //         correct_answer: 1,
  //         choices: [
  //           { id: 1, text: "" },
  //           { id: 2, text: "" },
  //         ],
  //         is_deleted: false,
  //       });
  //       return tempQuestions;
  //     });

  //     setQuestions((oldData) => [
  //       ...oldData,
  //       <QuestionEdit
  //         key={tempKey}
  //         qNumber={tempKey}
  //         questionText=""
  //         questionGrade={1}
  //         correctChoice={1}
  //         newQuestionFlag={true}
  //         onChoiceChange={(choiceId) => {}}
  //         choices={[
  //           { id: 1, text: "" },
  //           { id: 2, text: "" },
  //         ]}
  //         onChangeData={editQHandler}
  //         onDelete={deleteQHandler}
  //         ref={questionRef}
  //       />,
  //     ]);
  //     setNewQuestionFlag(false);
  //   };
  // }, [newQuestionFlag]);

  return (
    <section>
      <div className="border border-secondary m-2 p-3">
        <label htmlFor="max_grade">Max Grade</label>
        <input
          type="number"
          id="max_grade"
          value={maxGrade}
          readOnly
          className="border border-warning"
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
          <ol>
            {questions}
            <li
              key="add-question"
              className="btn btn-success col-12"
              onClick={addQuestionHandler}
            >
              <div className="card-body row-4"></div>
              <div className="card-body row-4">
                <h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="130"
                    height="130"
                    fill="#ffffff"
                    class="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                </h2>
              </div>
              <div className="card-body row-4"></div>
            </li><div className="btn btn-warning col-12 my-3">
            <button type="submit" className="btn btn-warning">
              Save
            </button>
          </div>
          </ol>
          
        </form>
      </div>
    </section>
  );
}

export default ExamQuestionsEdit;
