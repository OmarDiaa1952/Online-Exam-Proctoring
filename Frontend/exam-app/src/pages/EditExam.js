import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import ExamQuestionsEdit from "../components/ExamQuestionsEdit";
import EditExamInfo from "../components/EditExamInfo";
import UserContext from "../store/user-context";
import { get, post, put, dlt } from "../utils/Fetch";

function EditExamPage() {
  const userCtx = useContext(UserContext);
  const courseId = userCtx.courseId;
  const examId = userCtx.examId;
  let [examDetails, setExamDetails] = useState([]);
  let [examQuestions, setExamQuestions] = useState([]);
  let [delayExamDetails, setDelayExamDetails] = useState(false);
  let [delayExamQuestions, setDelayExamQuestions] = useState(false);

  useEffect(() => {}, [examQuestions, examDetails]);
  useEffect(() => {
    getExamDetails();
  }, [examId]);

  useEffect(() => {
    getExamDetails();
    getExamQuestions();
  }, []);

  let getExamDetails = async () => {
    if (examId) {
      let response = await get(
        "http://localhost:8000/main_app/examdetail/" + examId,
        userCtx.authTokens.access
      );
      let data = await response.json();
      if (response.status === 200) {
        // console.log(data);
        setExamDetails(data);
        setDelayExamDetails(true);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let getExamQuestions = async () => {
    if (examId) {
      let response = await get(
        "http://localhost:8000/main_app/questionlist/" + examId,
        userCtx.authTokens.access
      );
      let data = await response.json();
      if (response.status === 200) {
        data = data.map((question) => {
          return {
            ...question,
            choices: question.choices.map((choice, index) => {
              return {
                id: index + 1,
                text: choice,
              };
            }),
          };
        });
        setExamQuestions(data);
        // console.log(data);
        await timeout(1000);
        setDelayExamQuestions(true);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    } else {
      setDelayExamQuestions(true);
    }
  };

  let examDetailsHandler = async (e) => {
    e.preventDefault();
    const sub_url = examId ? "examedit/" + examId : "examcreate";
    let examDetails = {
      name: e.target.name.value,
      description: e.target.description.value,
      course_id: courseId,
      exam_start_date:
        e.target.exam_start_date.value +
        "T" +
        e.target.exam_start_time.value +
        ":00",
      exam_end_date:
        e.target.exam_end_date.value +
        "T" +
        e.target.exam_end_time.value +
        ":00",
      duration:
        e.target.duration_hours.value +
        ":" +
        e.target.duration_minutes.value +
        ":00",
    };
    let response =
      examId !== null
        ? await put(
            "http://localhost:8000/main_app/" + sub_url,
            examDetails,
            userCtx.authTokens.access
          )
        : await post(
            "http://localhost:8000/main_app/" + sub_url,
            examDetails,
            userCtx.authTokens.access
          );
    let data = await response.json();
    console.log(data);
    if (response.status === 200 || response.status === 201) {
      if (data.id) {
        userCtx.setExamId(data.id);
        setDelayExamDetails(false);
      }
      swal({
        title: "Success!",
        text: "Exam has been saved successfully!",
        icon: "success",
        button: "OK",
      });
      // history("/preview-exam");
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let questionChangeHandler = async (question, newQuestionFlag) => {
    console.log(question);
    if (examId) {
      let oldQuestion = examQuestions.find((q) => q.id === question.id);
      let editedQuestion = {
        exam_id: examId,
        id: question.id,
        question_text: question.question_text
          ? question.question_text
          : oldQuestion.question_text,
        marks: question.marks ? question.marks : oldQuestion.marks,
        choices: question.choices
          ? question.choices.map((choice) => choice.text) : oldQuestion.choices.map((choice) => choice.text),
        correct_answer: question.correct_answer
          ? question.correct_answer + ""
          : oldQuestion.correct_answer + "",
      };
      question = editedQuestion;
    }
    const sub_url =
      examId && !newQuestionFlag
        ? "questionedit/" + question.id
        : "questioncreate";
    let response =
      examId && !newQuestionFlag
        ? await put(
            "http://localhost:8000/main_app/" + sub_url,
            question,
            userCtx.authTokens.access
          )
        : await post(
            "http://localhost:8000/main_app/" + sub_url,
            question,
            userCtx.authTokens.access
          );
    if (response.status === 200 || response.status === 201) {
      // history("/preview-exam");
    } else if (response.statusText === "Unauthorized") {
      alert("Something went wrong!");
    }
  };

  let deleteQuestionHandler = async (id) => {
    if (examQuestions.some((q) => q.id === id)) {
      let response = await dlt(
        "http://localhost:8000/main_app/questiondelete/" + id,
        userCtx.authTokens.access
      );
      if (response.status === 204) {
        setExamQuestions(examQuestions.filter((q) => q.id !== id));
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let questionsChangeHandler = (questions, editedQuestionsIds) => {
    questions.forEach((question) => {
      if (question.is_deleted) {
        deleteQuestionHandler(question.id);
      } else if (editedQuestionsIds.some((id) => question.id === id)) {
        let newQuestionFlag = true;
        if (examQuestions.some((q) => q.id === question.id)) {
          newQuestionFlag = false;
        }
        questionChangeHandler(question, newQuestionFlag);
      }
    });
    swal({
      title: "Success!",
      text: "Exam has been updated successfully!",
      icon: "success",
      button: "OK",
    });
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <section>
      <h1>Edit Exam</h1>
      <div>
        {(delayExamDetails || !examId) && (
          <EditExamInfo examData={examDetails} onSave={examDetailsHandler} />
        )}
      </div>
      {examId && (examQuestions.length > 0 || delayExamQuestions) && (
        <div>
          <ExamQuestionsEdit
            questions={examQuestions}
            editable={true}
            onSave={questionsChangeHandler}
            onDeleteQuestion={deleteQuestionHandler}
          />
        </div>
      )}
      <div>
        <div>
          <Link to={examId ? "/preview-exam" : "/course"}>
            <button type="button">Cancel</button>
          </Link>
        </div>
        <div>
          <Link to="/preview-exam">
            <button type="button">Preview Exam</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditExamPage;
