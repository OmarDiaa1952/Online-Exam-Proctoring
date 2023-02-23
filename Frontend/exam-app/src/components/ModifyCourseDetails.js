import { useContext, useRef } from "react";

import classes from "./ModifyCourseDetails.module.css";
import UserContext from "../store/user-context";
import CourseContext from "../store/course-context";

function ModifyCourseDetails(props) {
  const userCtx = useContext(UserContext);
  const courseCtx = useContext(CourseContext);

  const nameInputRef = useRef();
  const descriptionInputRef = useRef();
  const enrollmentOptionInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const enteredEnrollmentOption = enrollmentOptionInputRef.current.value;

    let courseData = {
      requestType: courseCtx.newCourseFlag ? "addCourse"  : "modifyCourse",
      examinerName: userCtx.email,
      courseName: enteredName,
      description: enteredDescription,
      enrollmentOption: enteredEnrollmentOption,
    };

    props.onSave(courseData);
  }

  return (
    <form onSubmit={submitHandler} >
      <div>
        <label htmlFor="courseName">Course Name</label>
        <input type="text" id="courseName" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" rows="5" />
      </div>
      <div>
        <div>
          <input
            type="radio"
            id="open"
            name="enrollment"
            value="open"
            defaultChecked
          />
          <label htmlFor="open">Open</label>
        </div>
        <div>
          <input type="radio" id="closed" name="enrollment" value="closed" />
          <label htmlFor="closed">Closed</label>
        </div>
      </div>
      <div>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default ModifyCourseDetails;
