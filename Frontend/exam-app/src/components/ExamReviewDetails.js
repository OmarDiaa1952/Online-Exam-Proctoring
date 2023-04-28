import classes from "./ExamReviewDetails.module.css";

function ExamReviewDetails(props) {
  return (
    <section>
      <h2>Exam Info</h2>
      <div>
        <div>
          <span>Start Date: </span>
          <span>{props.examData.examStartYear} / {props.examData.examStartMonth} / {props.examData.examStartDay} {props.examData.examStartHour}:{props.examData.examStartMinute}</span>
        </div>
        <div>
          <span>Submission Date: </span>
          <span>{props.examData.examSubmissionYear} / {props.examData.examSubmissionMonth} / {props.examData.examSubmissionDay} {props.examData.examSubmissionHour}:{props.examData.examSubmissionMinute}</span>
        </div>
        <div>
        <span>Grade: </span>
        <span>{props.examData.grade} / {props.examData.maxGrade}</span>
      </div>
      </div>
    </section>
  );
}

export default ExamReviewDetails;
