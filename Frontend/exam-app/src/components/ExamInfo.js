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
          <span>{props.examData.exam_start_date}</span>
        </div>
        <div>
          <span>End Date: </span>
          <span>{props.examData.exam_end_date}</span>
        </div>
        <div>
          <span>Duration: </span>
          <span>{props.examData.duration}</span>
        </div>
        <div>
        <span>Max Grade: </span>
        <span>{props.examData.max_grade}</span>
      </div>
      </div>
    </section>
  );
}

export default ExamInfo;
