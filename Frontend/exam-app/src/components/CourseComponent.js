import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./CourseComponent.module.css";
import UserContext from "../store/user-context";

function CourseComponent(props) {
  const userCtx = useContext(UserContext);
  let registered = false;
  if(userCtx.type === "examiner") registered = true;
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
