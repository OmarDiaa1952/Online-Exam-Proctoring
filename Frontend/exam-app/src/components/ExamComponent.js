import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./ExamComponent.module.css";
import UserContext from "../store/user-context";

function ExamComponent(props) {
  const userCtx = useContext(UserContext);
  return (
    <div>
      <button onClick={() => userCtx.setExamId(props.id)}>
        <Link
          to={userCtx.type === "student" ? "/exam-details" : "/preview-exam"}
        >
          {props.name}
        </Link>
      </button>
      {userCtx.type === "examiner" && (
        <button type="button" onClick={() => props.onDelete(props.id)}>
          Delete
        </button>
      )}
    </div>
  );
}

export default ExamComponent;
