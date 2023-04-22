import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./ExamComponent.module.css";
import UserContext from "../store/user-context";

function ExamComponent(props) {
  const userCtx = useContext(UserContext);
  return (
    <div className="card bg-light mb-3">
      <h4>{props.name}</h4>
      <p>{props.description}</p>
      <Link
        className="card-body"
        to={userCtx.type === "student" ? "/exam-details" : "/preview-exam"}
      >
        <button onClick={() => userCtx.setExamId(props.id)}>
          View Details
        </button>
      </Link>
      {userCtx.type === "examiner" && (
        <button type="button" onClick={() => props.onDelete(props.id)}>
          Delete
        </button>
      )}
    </div>
  );
}

export default ExamComponent;
