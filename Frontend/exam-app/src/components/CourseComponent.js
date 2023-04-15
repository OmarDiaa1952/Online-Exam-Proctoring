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
    <li key={props.courseData.id}>

      <Link to="/course-details">
        <button
          onClick={() => {
            userCtx.setCourseId(props.courseData.id);
          }}
        >
          <div>{props.courseData.name}</div>
          <div>ID: {props.courseData.id}</div>
        </button>
      </Link>

    </li>
  );
}

export default CourseComponent;
