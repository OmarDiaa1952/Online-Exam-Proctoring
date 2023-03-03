import classes from "./CourseInfo.module.css";

function CourseInfo(props) {
  return (
    <div>
      <div>
        <span>Course Name: </span>
        <span>{props.courseData.name}</span>
      </div>
      <div>
        <span>Course ID: </span>
        <span>{props.courseData.id}</span>
      </div>
      <div>
        <span>Examiner: </span>
        <span>{props.courseData.examiner_name}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{props.courseData.description}</span>
      </div>
    </div>
  );
}

export default CourseInfo;
