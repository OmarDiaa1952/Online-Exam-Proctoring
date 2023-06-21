import classes from "./ExamReviewDetails.module.css";

function ExamReviewDetails(props) {
  return (
    <div className="card bg-light mb-5 border border-success m-3">
    <div className="card-body">
    <section>
      <h2 className="card-title">Exam Info</h2>
      <table className="card-body">
        <tbody>
        <tr>
          <th className="cell" scope="row">Start Date: </th>
          <td className="cell">{props.examData.examStartYear} / {props.examData.examStartMonth} / {props.examData.examStartDay} {props.examData.examStartHour}:{props.examData.examStartMinute}</td>
        </tr>
        <tr>
          <th className="cell" scope="row">Submission Date: </th>
          <td className="cell">{props.examData.examSubmissionYear} / {props.examData.examSubmissionMonth} / {props.examData.examSubmissionDay} {props.examData.examSubmissionHour}:{props.examData.examSubmissionMinute}</td>
        </tr>
        <tr>
        <th className="cell" scope="row">Grade: </th>
        <td className="cell">{props.examData.grade} / {props.examData.maxGrade}</td>
      </tr></tbody>
      </table>
    </section>
    </div>
    </div>
  );
}

export default ExamReviewDetails;
