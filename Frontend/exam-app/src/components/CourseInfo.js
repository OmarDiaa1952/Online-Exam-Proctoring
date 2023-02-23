import classes from "./CourseInfo.module.css";

function CourseInfo(props) {
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
    </div>
  );
}

export default CourseInfo;
