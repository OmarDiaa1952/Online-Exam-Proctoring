import classes from "./EnrollCourse.module.css";

function EnrollCourse(props) {
  function submitHandler() {
    props.onRequestCourse(props.courseData.courseId);
  }
  return (
    <div>
      <div>
        <span>Course Name: </span>
        <span>{props.courseData.courseName}</span>
      </div>
      <div>
        <span>Course ID: </span>
        <span>{props.courseData.courseId}</span>
      </div>
      <div>
        <span>Examiner: </span>
        <span>{props.courseData.examinerName}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{props.courseData.courseDescription}</span>
      </div>
      <div>
        <button type="submit" onClick={submitHandler}>
          Enroll
        </button>
      </div>
    </div>
  );
}

export default EnrollCourse;
