import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import ExamInfo from "../components/ExamInfo";
import ExamQuestions from "../components/ExamQuestions";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function PreviewExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  const [maxGrade, setMaxGrade] = useState(0);
  let [examDetails, setExamDetails] = useState([]);
  let [examQuestions, setExamQuestions] = useState([]);
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getExamDetails();
    getExamQuestions();
  }, []);

  useEffect(() => {
    setMaxGrade(
      examQuestions.reduce((acc, question) => acc + question.questionGrade, 0)
    );
  }, [examQuestions]);

  let getExamDetails = async () => {
    if (examId) {
      setIsLoading(true);
      let response = await get(
        BASEURL + "/main_app/examdetail/" + examId,
        userCtx.authTokens.access
      );
      let data = await response.json();
      if (response.status === 200) {
        const examDate = {
          exam_start_year: data.exam_start_date.substring(0, 4),
          exam_start_month: data.exam_start_date.substring(5, 7),
          exam_start_day: data.exam_start_date.substring(8, 10),
          exam_start_hour: data.exam_start_date.substring(11, 13),
          exam_start_minute: data.exam_start_date.substring(14, 16),
          exam_end_year: data.exam_end_date.substring(0, 4),
          exam_end_month: data.exam_end_date.substring(5, 7),
          exam_end_day: data.exam_end_date.substring(8, 10),
          exam_end_hour: data.exam_end_date.substring(11, 13),
          exam_end_minute: data.exam_end_date.substring(14, 16),
        };
        setExamDetails({ ...data, ...examDate });
        setIsLoading(false);
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    }
  };
  let getExamQuestions = async () => {
    if (examId) {
      setIsLoading(true);
      let response = await get(
        BASEURL + "/main_app/questionlist/" + examId,
        userCtx.authTokens.access
      );
      let data = await response.json();
      if (response.status === 200) {
        setExamQuestions(
          data.map((question) => ({
            questionId: question.id,
            questionText: question.question_text,
            questionGrade: question.marks,
            correctAnswer: question.correct_answer,
            choices: question.choices.map((choice, index) => {
              return {
                id: index + 1,
                text: choice,
              };
            }),
          }))
        );
        setIsLoading(false);
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    }
  };

  return (
    <section>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div className="general">
            <div>
              <ExamInfo examData={examDetails} maxGrade={maxGrade} />
            </div>
            <ExamQuestions questions={examQuestions} editable={false} />
            <div>
              <div>
                <Link to="/log-file">
                  <button type="button" className="btn btn-success">View Log File</button>
                </Link>
              </div>
              <div>
                <Link to="/edit-exam">
                  <button type="button" className="btn btn-secondary">Edit</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PreviewExamPage;
