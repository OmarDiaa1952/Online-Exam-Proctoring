import classes from "./ExamInfo.module.css";

function ExamInfo(props) {
  let gradeDiv = null;
  if ('studentGrade' in props.examData) {
    gradeDiv = (
      <div>
        <span>Grade: </span>
        <span>
          {props.examData.studentGrade} / {props.examData.maxGrade}
        </span>
      </div>
    );
  }
  else {
    gradeDiv = (
      <div>
        <span>Max Grade: </span>
        <span>
          {props.examData.maxGrade}
        </span>
      </div>
    );
  }
  return (
    <section>
      <h2>Exam Info</h2>
      <div>
        <div>
          <span>Start Date: </span>
          <span>{props.examData.startDate}</span>
        </div>
        <div>
          <span>End Date: </span>
          <span>{props.examData.endDate}</span>
        </div>
        <div>
          <span>Duration: </span>
          <span>{props.examData.examDuration}</span>
        </div>
        {gradeDiv}
      </div>
    </section>
  );
}

export default ExamInfo;
