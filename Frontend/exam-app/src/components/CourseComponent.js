import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./CourseComponent.module.css";
import UserContext from "../store/user-context";

function CourseComponent(props) {
  const userCtx = useContext(UserContext);
  let registered = false;
  if(userCtx.type === "examiner") registered = true;
  return (
    <li key={props.courseData.id}>
      <button onClick={()=>{userCtx.setCourseId(props.courseData.id)}}><Link to={registered ? "/course" : "/course-details"}>
        <div>{props.courseData.name}</div>
        <div>ID: {props.courseData.id}</div>
      </Link></button>
    </li>
  );
}

export default CourseComponent;
