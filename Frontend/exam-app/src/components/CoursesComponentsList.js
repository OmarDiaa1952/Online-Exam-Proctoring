import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./CoursesComponentsList.module.css";
import CourseComponent from "./CourseComponent";
import UserContext from "../store/user-context";

function CoursesComponentsList(props) {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="container testimonial-group">
      <ul className="row text-center flex-nowrap">
        {userCtx.type === "examiner" && (
          <li
            key="add-course"
            className="card bg-success mb-3 mx-3 col-sm-2 border border-secondary d-flex justify-content-center align-items-center flex-column cursor-hover"
            onClick={() => navigate("/modify-course")}
          >
            <div className="card-body">
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
          </li>
        )}
        {props.coursesData.map((courseData) => (
          <CourseComponent
            courseData={courseData}
            key={courseData.id}
            // findEnrollmentStatus={props.findEnrollmentStatus}
            // enrollmentStatus={props.enrollmentStatus}
          />
        ))}
      </ul>
    </div>
  );
}

export default CoursesComponentsList;
