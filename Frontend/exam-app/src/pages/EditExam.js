import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import ExamQuestionsEdit from "../components/ExamQuestionsEdit";
import EditExamInfo from "../components/EditExamInfo";
import UserContext from "../store/user-context";
import { get, post, put, dlt } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";

function EditExamPage() {
  const userCtx = useContext(UserContext);
  const courseId = userCtx.courseId;
  const examId = userCtx.examId;
  let [examDetails, setExamDetails] = useState([]);
  let [examQuestions, setExamQuestions] = useState([]);
  let [delayExamDetails, setDelayExamDetails] = useState(false);
  let [delayExamQuestions, setDelayExamQuestions] = useState(false);
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [examQuestions, examDetails]);
  useEffect(() => {
    getExamDetails();
  }, [examId]);

  useEffect(() => {
    getExamDetails();
    getExamQuestions();
  }, []);

  let getExamDetails = async () => {
    setIsLoading(true);
    if (examId) {
      let response = await get(
        BASEURL + "/main_app/examdetail/" + examId,
        userCtx.authTokens.access
      );
      let data = await response.json();
      if (response.status === 200) {
        // console.log(data);
        setExamDetails(data);
        setDelayExamDetails(true);
        setIsLoading(false);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let getExamQuestions = async () => {
    setIsLoading(true);
    if (examId) {
      let response = await get(
        BASEURL + "/main_app/questionlist/" + examId,
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
        setIsLoading(false);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    } else {
      setDelayExamQuestions(true);
    }
  };

  let examDetailsHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let warningMsgs = [];
    let startYear = Number(e.target.exam_start_date.value.split("-")[0]);
    let startMonth = Number(e.target.exam_start_date.value.split("-")[1]);
    let startDay = Number(e.target.exam_start_date.value.split("-")[2]);
    let endYear = Number(e.target.exam_end_date.value.split("-")[0]);
    let endMonth = Number(e.target.exam_end_date.value.split("-")[1]);
    let endDay = Number(e.target.exam_end_date.value.split("-")[2]);
    let startHour = Number(e.target.exam_start_time.value.split(":")[0]);
    let startMinute = Number(e.target.exam_start_time.value.split(":")[1]);
    let endHour = Number(e.target.exam_end_time.value.split(":")[0]);
    let endMinute = Number(e.target.exam_end_time.value.split(":")[1]);
    let durationHours = Number(e.target.duration_hours.value);
    let durationMinutes = Number(e.target.duration_minutes.value);
    console.log(e.target.duration_hours.value, e.target.duration_minutes.value);

    if (durationHours === 0 && durationMinutes === 0) {
      // console.log(durationHours, durationMinutes);
      warningMsgs.push("Duration can't be equal to zero!");
    }
    if (
      startYear > endYear ||
      (startMonth > endMonth && startYear === endYear) ||
      (startDay > endDay && startMonth === endMonth && startYear === endYear)
    ) {
      warningMsgs.push("Exam end date can't be before exam start date!");
    }
    if (
      durationHours * 60 + durationMinutes * 1 >
      (endYear - startYear) * 365 * 24 * 60 +
        (endMonth - startMonth) * 30 * 24 * 60 +
        (endDay - startDay) * 24 * 60 +
        (endHour - startHour) * 60 +
        (endMinute - startMinute)
    ) {
      warningMsgs.push("Exam duration can't be longer than exam period!");
    }
    if (warningMsgs.length > 0) {
      swal({
        title: "Error!",
        text: warningMsgs.join("\n"),
        icon: "warning",
        button: "OK",
      });
      return;
    }
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
            BASEURL + "/main_app/" + sub_url,
            examDetails,
            userCtx.authTokens.access
          )
        : await post(
            BASEURL + "/main_app/" + sub_url,
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
      setIsLoading(false);
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
          ? question.choices.map((choice) => choice.text)
          : oldQuestion.choices.map((choice) => choice.text),
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
            BASEURL + "/main_app/" + sub_url,
            question,
            userCtx.authTokens.access
          )
        : await post(
            BASEURL + "/main_app/" + sub_url,
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
        BASEURL + "/main_app/questiondelete/" + id,
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div>
            {(delayExamDetails || !examId) && (
              <EditExamInfo
                examData={examDetails}
                onSave={examDetailsHandler}
              />
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
            {examId && (
              <div>
                <Link to="/preview-exam">
                  <button type="button">Preview Exam</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default EditExamPage;
