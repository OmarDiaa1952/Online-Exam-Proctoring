import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import ExamQuestions from "../components/ExamQuestions";
import UserContext from "../store/user-context";
import ExamReviewDetails from "../components/ExamReviewDetails";

function ReviewExamPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;

  let [examDetails, setExamDetails] = useState({});
  let [examQuestions, setExamQuestions] = useState([]);

  useEffect(() => {
    Review();
  }, []);

  let Review = async () => {
    if (examId) {
      let response = await fetch(
        "http://localhost:8000/main_app/examreview/" + examId,
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
        setExamDetails({
          id: data.id,
          examId: data.exam_id,
          startTime: data.start_time,
          submissionTime: data.submission_time,
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