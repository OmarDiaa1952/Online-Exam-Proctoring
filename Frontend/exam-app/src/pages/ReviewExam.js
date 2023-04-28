import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import ExamQuestions from "../components/ExamQuestions";
import UserContext from "../store/user-context";
import ExamReviewDetails from "../components/ExamReviewDetails";
import { get } from "../utils/Fetch";

function ReviewExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;

  let [examDetails, setExamDetails] = useState({});
  let [examQuestions, setExamQuestions] = useState([]);

  useEffect(() => {
    Review();
  }, []);

  useEffect(() => {
    getMaxGrade();
  }, [examQuestions]);

  let Review = async () => {
    if (examId) {
      let response = await get("http://localhost:8000/main_app/examreview/" + examId, userCtx.authTokens.access)
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
            choice1: answer.question.choice_1,
            choice2: answer.question.choice_2,
            choice3: answer.question.choice_3,
            choice4: answer.question.choice_4,
            choice: answer.choice,
          }))
        );
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
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
      <h1>Review Exam Page</h1>
      <ExamReviewDetails examData={examDetails} />
      <ExamQuestions questions={examQuestions} editable={false} />
      <div>
        <div>
          <Link to="/exam-details">
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

export default ReviewExamPage;