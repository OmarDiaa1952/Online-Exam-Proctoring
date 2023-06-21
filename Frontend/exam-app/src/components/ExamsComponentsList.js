import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./ExamsComponentsList.module.css";
import ExamComponent from "./ExamComponent";
import UserContext from "../store/user-context";

function ExamsComponentsList(props) {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="container testimonial-group">
        <h2>Course Exams:</h2>
      <ul className="row text-center flex-nowrap">
      {userCtx.type === "examiner" && (
          <li
            key="add-exam"
            className="card bg-success mb-3 mx-3 col-sm-2 border border-secondary d-flex justify-content-center align-items-center flex-column cursor-hover"
            onClick={() => navigate("/edit-exam")}
          >
            <div className="card-body row-4"></div>
            <div className="card-body row-4">
              <h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="130"
                  height="130"
                  fill="#ffffff"
                  class="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
              </h2>
            </div>
            <div className="card-body row-4"></div>
          </li>
        )}
        {props.components.map((component) => {
          return (
            <ExamComponent
              key={component.id}
              id={component.id}
              course_id={component.course_id}
              description={component.description}
              duration={component.duration}
              exam_end_date={component.exam_end_date}
              exam_start_date={component.exam_start_date}
              max_grade={component.max_grade}
              name={component.name}
              onDelete={props.onDelete}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default ExamsComponentsList;
