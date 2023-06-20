import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import classes from "./CourseComponent.module.css";
import UserContext from "../store/user-context";

function CourseComponent(props) {
  // const [isEnrolled, setIsEnrolled] = useState(true);
  const userCtx = useContext(UserContext);

  // useEffect(() => {
  //   if (userCtx.type === "student") {
  //     props.findEnrollmentStatus(props.courseData.id);
  //     setIsEnrolled(props.enrollmentStatus);
  //   }
  // }, []);

  return (
    <li key={props.courseData.id} className="card bg-light mb-3 mx-3 col-sm-4 border border-secondary">
      <div className="card-body">
        <h4>{props.courseData.name}</h4>
        <h6>ID: {props.courseData.id}</h6>
        <Link to="/course-details">
          <button
          className="btn btn-outline-success"
            onClick={() => {
              userCtx.setCourseId(props.courseData.id);
              userCtx.setCourseName(props.courseData.name);
            }}
          >
            <div>View Details</div>
          </button>
        </Link>
      </div>
    </li>
  );
}

export default CourseComponent;
