import { useContext } from "react";
import { Link } from "react-router-dom";

import classes from "./CourseInfo.module.css";
import UserContext from "../store/user-context";

function CourseInfo(props) {
  const userCtx = useContext(UserContext);
  return (
    <div>
      <div className="card bg-light mb-5 border border-success m-3">
        <div className="card-body">
          <section>
            <h2 className="card-title">Course Info</h2>
            <table className="table table-sm">
              <tbody>
                <tr>
                  <th className="cell" scope="row">
                    Course Name:{" "}
                  </th>
                  <td className="cell">{props.courseData.name}</td>
                </tr>
                <tr>
                  <th className="cell" scope="row">
                    Course ID:{" "}
                  </th>
                  <td className="cell">{props.courseData.id}</td>
                </tr>
                <tr>
                  <th className="cell" scope="row">
                    Examiner:{" "}
                  </th>
                  <td className="cell">{props.courseData.examiner}</td>
                </tr>
                <tr>
                  <th className="cell" scope="row">
                    Description:{" "}
                  </th>
                  <td className="cell prewrap">
                    {props.courseData.description}
                  </td>
                </tr>
              </tbody>
            </table>
            {userCtx.type === "examiner" ? (
              <div className="d-flex flex-row justify-content-between">
                <div>
                  <Link to="/modify-course" state={props.courseData.id}>
                    <button type="button" className="btn btn-secondary">
                      Edit Course
                    </button>
                  </Link>
                </div>
                <div>
                  <Link to="/course-students">
                    <button type="button" className="btn btn-outline-success">
                      View Students
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={props.leaveCourse}
                  className="btn btn-secondary"
                >
                  Leave Course
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CourseInfo;
