import { useContext } from "react";
import { Link } from "react-router-dom";

import classes from "./ExamInfo.module.css";
import UserContext from "../store/user-context";

function ExamInfo(props) {
  const userCtx = useContext(UserContext);
  return (
    <div className="card bg-light mb-5 border border-success m-3">
      <div className="card-body">
        <section>
          <h2 className="card-title">Exam Info</h2>
          <table className="table table-sm">
            <tbody>
              <tr>
                <th className="cell" scope="row">
                  Exam Name:{" "}
                </th>
                <td className="cell">{props.examData.name}</td>
              </tr>
              <tr>
                <th className="cell" scope="row">
                  Description:{" "}
                </th>
                <td className="cell">{props.examData.description}</td>
              </tr>
              <tr>
                <th className="cell" scope="row">
                  Start Date:{" "}
                </th>
                <td className="cell">
                  {props.examData.exam_start_year} /{" "}
                  {props.examData.exam_start_month} /{" "}
                  {props.examData.exam_start_day}{" "}
                  {props.examData.exam_start_hour}:
                  {props.examData.exam_start_minute}
                </td>
              </tr>
              <tr>
                <th className="cell" scope="row">
                  End Date:{" "}
                </th>
                <td className="cell">
                  {props.examData.exam_end_year} /{" "}
                  {props.examData.exam_end_month} /{" "}
                  {props.examData.exam_end_day} {props.examData.exam_end_hour}:
                  {props.examData.exam_end_minute}
                </td>
              </tr>
              <tr>
                <th className="cell" scope="row">
                  Duration:{" "}
                </th>
                <td className="cell">{props.examData.duration}</td>
              </tr>
              {props.maxGrade ? (
                <tr>
                  <th className="cell" scope="row">
                    Max Grade:{" "}
                  </th>
                  <td className="cell">{props.maxGrade}</td>
                </tr>
              ) : (
                <tr>
                  <th className="cell" scope="row">
                    Max Grade:{" "}
                  </th>
                  <td className="cell">{props.examData.max_grade}</td>
                </tr>
              )}
            </tbody>
          </table>
          {userCtx.type === "examiner" && (
            <div className="d-flex flex-row justify-content-between">
              <div>
                <Link to="/edit-exam">
                  <button type="button" className="btn btn-secondary">
                    Edit Exam
                  </button>
                </Link>
              </div>
              <div>
                <Link to="/log-file">
                  <button type="button" className="btn btn-outline-success">
                    View Log File
                  </button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ExamInfo;
