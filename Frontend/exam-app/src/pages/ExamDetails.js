import { useContext } from "react";
import { Link } from "react-router-dom";

import ExamInfo from "../components/ExamInfo";
import UserContext from "../store/user-context";

function ExamDetailsPage() {
  const userCtx = useContext(UserContext);
  const email = userCtx.email;
  const DUMMY_DATA = {
    startDate: "2021-05-01",
    endDate: "2021-05-31",
    examDuration: "2:00",
    maxGrade: 100,
    studentGrade: 0,
  };
  return (
    <section>
      <ExamInfo examData={DUMMY_DATA} />
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
