import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ExamInfo from "../components/ExamInfo";
import UserContext from "../store/user-context";

function ExamDetailsPage() {
  const userCtx = useContext(UserContext);
  const examId = userCtx.examId;
  let [examDetails, setExamDetails] = useState([]);

  useEffect(() => {
    getExamDetails();
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
  return (
    <section>
      <ExamInfo examData={examDetails} />
      <div>
        <Link to="/exam">
          <button type="button">Start Exam</button>
        </Link>
      </div>
      <div>
        <Link to="/review-exam">
          <button type="button">Review Exam</button>
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
    </section>
  );
}

export default ExamDetailsPage;
