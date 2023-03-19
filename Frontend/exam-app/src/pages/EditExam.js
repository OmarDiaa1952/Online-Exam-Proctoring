import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import ExamQuestionsEdit from "../components/ExamQuestionsEdit";
import EditExamInfo from "../components/EditExamInfo";
import UserContext from "../store/user-context";

function EditExamPage() {
  const userCtx = useContext(UserContext);
  const courseId = userCtx.courseId;
  const examId = userCtx.examId;
  const history = useNavigate();
  let [examDetails, setExamDetails] = useState([]);
  let [examQuestions, setExamQuestions] = useState([]);

  useEffect(() => {}, [examQuestions]);

  useEffect(() => {
    getExamDetails();
    getExamQuestions();
  }, []);

  let getExamDetails = async () => {
    if (examId) {
      let response = await fetch(
        "http://localhost:8000/main_app/examdetail/" + examId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(userCtx.authTokens.access),
          },
        }
      );
      let data = await response.json();
      if (response.status === 200) {
        setExamDetails(data);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let getExamQuestions = async () => {
    if (examId) {
      let response = await fetch(
        "http://localhost:8000/main_app/questionlist/" + examId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(userCtx.authTokens.access),
          },
        }
      );
      let data = await response.json();
      if (response.status === 200) {
        setExamQuestions(data);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let examDetailsHandler = async (e) => {
    e.preventDefault();
    const sub_url = examId ? "examedit/" + examId : "examcreate";
    let response = await fetch("http://localhost:8000/main_app/" + sub_url, {
      method: examId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(userCtx.authTokens.access),
      },
      body: JSON.stringify({
        name: e.target.name.value,
        description: e.target.description.value,
        course_id: courseId,
        exam_start_date: "2020-05-05T12:12:01",
        exam_end_date: "2050-05-05T12:12:12",
        duration: "00:00:05",
        max_grade: e.target.max_grade.value,
      }),
    });
    if (response.status === 200 || response.status === 201) {
      history("/preview-exam");
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let questionChangeHandler = async (question) => {
    if(examId) {
      let oldQuestion = examQuestions.find(q => q.questionId === question.questionId);
      let editedQuestion = {
        questionId: question.questionId,
        questionText: question.questionText ? question.questionText : oldQuestion.questionText,
        questionGrade: question.questionGrade ? question.questionGrade : oldQuestion.questionGrade,
        choice1: question.choice1 ? question.choice1 : oldQuestion.choice1,
        choice2: question.choice2 ? question.choice2 : oldQuestion.choice2,
        choice3: question.choice3 ? question.choice3 : oldQuestion.choice3,
        choice4: question.choice4 ? question.choice4 : oldQuestion.choice4,
        correctChoice: question.correctChoice ? question.correctChoice : oldQuestion.correctChoice,
      }
      question = editedQuestion;
    }
    console.log("questionChangeHandler");
    console.log(question);
    const sub_url = examId ? "questionedit/" + question.questionId : "questioncreate";
    let response = await fetch("http://localhost:8000/main_app/" + sub_url, {
      method: examId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(userCtx.authTokens.access),
      },
      body: JSON.stringify({
        exam_id: examId,
        question_text: question.questionText,
        marks: question.questionGrade,
        choice_1: question.choice1,
        choice_2: question.choice2,
        choice_3: question.choice3,
        choice_4: question.choice4,
        correct_answer: question.correctChoice,
      }),
    });
    if (response.status === 200 || response.status === 201) {
      history("/preview-exam");
    } else if (response.statusText === "Unauthorized") {
      alert("Something went wrong!");
    }
  };

  let questionsChangeHandler = (questions, editedQuestionsIds) => {
    console.log("questionsChangeHandler");
    console.log(questions);
    questions.forEach((question) => {
      if (editedQuestionsIds.some((id) => question.questionId === id)) {
        questionChangeHandler(question);
      }
    });
  };

  return (
    <section>
      <h1>Edit Exam</h1>
      <div>
        <EditExamInfo examData={examDetails} onSave={examDetailsHandler} />
      </div>
      {examQuestions.length > 0 && <div>
        <ExamQuestionsEdit
          questions={examQuestions}
          editable={true}
          onSave={questionsChangeHandler}
        />
      </div>}
      <div>
        <div>
          <Link to={userCtx.examId ? "/preview-exam" : "/course"}>
            <button type="button">Cancel</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditExamPage;
