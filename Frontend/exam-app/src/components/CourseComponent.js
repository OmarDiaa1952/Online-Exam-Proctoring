import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./CourseComponent.module.css";

function CourseComponent(props) {
  const registered = false;
  return (
    <li key={props.courseData.courseId}>
      <Link to={registered ? "/course" : "/course-details"}>
        <div>{props.courseData.courseName}</div>
        <div>ID: {props.courseData.courseId}</div>
      </Link>
    </li>
  );
}

export default CourseComponent;
