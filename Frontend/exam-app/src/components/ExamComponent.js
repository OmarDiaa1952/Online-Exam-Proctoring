import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./ExamComponent.module.css";
import UserContext from "../store/user-context";

function ExamComponent(props) {
  const userCtx = useContext(UserContext);
  return (
    <div className="card bg-light mb-3">
      <div className="card-body">
        <h4 className="card-title">{props.name}</h4>
        <p className="card-text">{props.description}</p>
        <div className="container">
          <div className="mr-3">
            <Link to={userCtx.type === "student" ? "/exam-details" : "/preview-exam"}>
              <button
               className="btn btn-success"
                onClick={() => {
                  userCtx.setExamId(props.id);
                  userCtx.setExamName(props.name);
                  }}>
                View Details
              </button>
            </Link>
          </div>
          {userCtx.type === "examiner" && (
            <div className="ml-auto pl-3">
              <button type="button"
                className="btn btn-secondary"
                onClick={() => props.onDelete(props.id)}>
                Delete
              </button>
            </div>

          )}
        </div>

      </div>
    </div>
  );
}

export default ExamComponent;
