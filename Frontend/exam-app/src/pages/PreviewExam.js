import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import ExamInfo from "../components/ExamInfo";
import ExamQuestions from "../components/ExamQuestions";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";

function PreviewExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  const [maxGrade, setMaxGrade] = useState(0);
  let [examDetails, setExamDetails] = useState([]);
  let [examQuestions, setExamQuestions] = useState([]);

  useEffect(() => {
    getExamDetails();
    getExamQuestions();
  }, []);

  useEffect(() => {
    setMaxGrade(examQuestions.reduce((acc, question) => acc + question.questionGrade, 0));
  }, [examQuestions]);

  let getExamDetails = async () => {
    if (examId) {
      let response = await get("http://localhost:8000/main_app/examdetail/" + examId, userCtx.authTokens.access);
      let data = await response.json();
      if (response.status === 200) {
        const examDate = {
          exam_start_year: Number(data.exam_start_date.substring(0, 4)),
          exam_start_month: Number(data.exam_start_date.substring(5, 7)),
          exam_start_day: Number(data.exam_start_date.substring(8, 10)),
          exam_start_hour: Number(data.exam_start_date.substring(11, 13)),
          exam_start_minute: Number(data.exam_start_date.substring(14, 16)),
          exam_end_year: Number(data.exam_end_date.substring(0, 4)),
          exam_end_month: Number(data.exam_end_date.substring(5, 7)),
          exam_end_day: Number(data.exam_end_date.substring(8, 10)),
          exam_end_hour: Number(data.exam_end_date.substring(11, 13)),
          exam_end_minute: Number(data.exam_end_date.substring(14, 16)),
        };
        setExamDetails({ ...data, ...examDate });
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };
  let getExamQuestions = async () => {
    if (examId) {
      let response = await get("http://localhost:8000/main_app/questionlist/" + examId, userCtx.authTokens.access);
      let data = await response.json();
      if (response.status === 200) {
        setExamQuestions(
          data.map((question) => ({
            questionId: question.id,
            questionText: question.question_text,
            questionGrade: question.marks,
            correctAnswer: question.correct_answer,
            choice1: question.choice_1,
            choice2: question.choice_2,
            choice3: question.choice_3,
            choice4: question.choice_4,
          }))
        );
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  return (
    <section>
      <div>
        <ExamInfo examData={examDetails} maxGrade={maxGrade} />
      </div>
      <ExamQuestions questions={examQuestions} editable={false} />
      <div>
        <div>
          <Link to="/log-file">
            <button type="button">View Log File</button>
          </Link>
        </div>
        <div>
          <Link to="/edit-exam">
            <button type="button">Edit</button>
          </Link>
        </div>
        <div>
          <Link to="/course">
            <button type="button">Back</button>
          </Link>
        </div>
        <div>
          <Link to="/">
            <button type="button">Home</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PreviewExamPage;
