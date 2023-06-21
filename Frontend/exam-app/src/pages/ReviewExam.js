import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import ExamQuestions from "../components/ExamQuestions";
import UserContext from "../store/user-context";
import ExamReviewDetails from "../components/ExamReviewDetails";
import { get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function ReviewExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;

  let [examDetails, setExamDetails] = useState({});
  let [examQuestions, setExamQuestions] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Review();
  }, []);

  useEffect(() => {
    getMaxGrade();
  }, [examQuestions]);

  let Review = async () => {
    if (examId) {
      setIsLoading(true);
      let response = await get(
        BASEURL + "/main_app/examreview/" + examId,
        userCtx.authTokens.access
      );
      let data = await response.json();
      if (response.status === 200) {
        setExamDetails({
          id: data.id,
          examId: data.exam_id,
          examStartYear: data.start_time.substring(0, 4),
          examStartMonth: data.start_time.substring(5, 7),
          examStartDay: data.start_time.substring(8, 10),
          examStartHour: data.start_time.substring(11, 13),
          examStartMinute: data.start_time.substring(14, 16),
          examSubmissionYear: data.submission_time.substring(0, 4),
          examSubmissionMonth: data.submission_time.substring(5, 7),
          examSubmissionDay: data.submission_time.substring(8, 10),
          examSubmissionHour: data.submission_time.substring(11, 13),
          examSubmissionMinute: data.submission_time.substring(14, 16),
          grade: data.grade,
        });
        setExamQuestions(
          data.answers.map((answer) => ({
            questionId: answer.question.id,
            questionText: answer.question.question_text,
            questionGrade: answer.question.marks,
            correctAnswer: answer.question.correct_answer,
            choices: answer.question.choices.map((choice, index) => ({
              id: index + 1,
              text: choice,
            })),
            choice: answer.choice,
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

  let getMaxGrade = () => {
    let maxGrade = 0;
    examQuestions.forEach((question) => {
      maxGrade += question.questionGrade;
    });
    setExamDetails((prevState) => ({
      ...prevState,
      maxGrade: maxGrade,
    }));
  };

  return (
    <section>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div className="general">
            <ExamReviewDetails examData={examDetails} />
            <ExamQuestions questions={examQuestions} editable={false} />
          </div>
        </div>
      )}
    </section>
  );
}

export default ReviewExamPage;
