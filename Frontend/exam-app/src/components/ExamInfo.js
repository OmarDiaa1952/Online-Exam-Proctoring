import classes from "./ExamInfo.module.css";

function ExamInfo(props) {
  return (
    <section>
      <h2>Exam Info</h2>
      <div>
        <div>
          <span>Exam Name: </span>
          <span>{props.examData.name}</span>
        </div>
        <div>
          <span>Description: </span>
          <span>{props.examData.description}</span>
        </div>
        <div>
          <span>Start Date: </span>
          <span>{props.examData.exam_start_year} / {props.examData.exam_start_month} / {props.examData.exam_start_day} {props.examData.exam_start_hour}:{props.examData.exam_start_minute}</span>
        </div>
        <div>
          <span>End Date: </span>
          <span>{props.examData.exam_end_year} / {props.examData.exam_end_month} / {props.examData.exam_end_day} {props.examData.exam_end_hour}:{props.examData.exam_end_minute}</span>
        </div>
        <div>
          <span>Duration: </span>
          <span>{props.examData.duration}</span>
        </div>
        {props.maxGrade ? <div>
          <span>Max Grade: </span>
          <span>{props.maxGrade}</span>
        </div> : <div>
          <span>Max Grade: </span>
          <span>{props.examData.max_grade}</span>
        </div>}
      </div>
    </section>
  );
}

export default ExamInfo;
