import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./ExamComponent.module.css";
import UserContext from "../store/user-context";

function ExamComponent(props) {
    const userCtx = useContext(UserContext);
  return (
    <div>
      <div>
        <Link to={userCtx.type === "student" ? "/exam-details" : "/preview-exam"}>{props.title}</Link>
        {userCtx.type === "examiner" && <button type="button">Delete</button>}
      </div>
    </div>
  );
}

export default ExamComponent;
