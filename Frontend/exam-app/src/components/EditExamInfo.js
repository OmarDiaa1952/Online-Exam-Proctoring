import { useContext } from "react";
import { Link } from "react-router-dom";

import classes from "./EditExamInfo.module.css";
import UserContext from "../store/user-context";

function EditExamInfo(props) {
  let examInfo = {
    examData: {
      name: "",
      description: "",
      exam_start_date: "",
      exam_end_date: "",
      exam_duration: "",
    },
  };
  const userCtx = useContext(UserContext);
  if (userCtx.examId) {
    examInfo.examData = props.examData;
  }
  return (
    <div className="card bg-light border border-success">
      {true && (
        <form onSubmit={props.onSave}>
          <div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">
                  Exam Name
                </label>
                <input
                  className="form-control border border-success"
                  type="text"
                  id="name"
                  defaultValue={
                    examInfo.examData.name ? examInfo.examData.name : ""
                  }
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control border border-success"
                  id="description"
                  rows="5"
                  defaultValue={
                    examInfo.examData.description
                      ? examInfo.examData.description
                      : ""
                  }
                />
              </div>
              <div className="row mb-3">
                <span className="col">
                  <label htmlFor="exam_start_date" className="col">
                    Start Date
                  </label>
                  <input
                    className="col border border-success"
                    type="date"
                    id="exam_start_date"
                    defaultValue={
                      examInfo.examData.exam_start_date
                        ? examInfo.examData.exam_start_date.substring(0, 10)
                        : ""
                    }
                  />
                </span>
                <span className="col">
                  <label htmlFor="exam_start_time" className="col">
                    Start Time
                  </label>
                  <input
                    className="col border border-success"
                    type="time"
                    id="exam_start_time"
                    defaultValue={
                      examInfo.examData.exam_start_date
                        ? examInfo.examData.exam_start_date.substring(11, 16)
                        : ""
                    }
                  />
                </span>
              </div>
              <div className="row mb-3">
                <span className="col">
                  <label htmlFor="exam_end_date" className="col">
                    End Date
                  </label>
                  <input
                    className="col border border-success"
                    type="date"
                    id="exam_end_date"
                    defaultValue={
                      examInfo.examData.exam_end_date
                        ? examInfo.examData.exam_end_date.substring(0, 10)
                        : ""
                    }
                  />
                </span>
                <span className="col">
                  <label htmlFor="exam_end_time" className="col">
                    End Time
                  </label>
                  <input
                    className="col border border-success"
                    type="time"
                    id="exam_end_time"
                    defaultValue={
                      examInfo.examData.exam_end_date
                        ? examInfo.examData.exam_end_date.substring(11, 16)
                        : ""
                    }
                  />
                </span>
              </div>
              <div className="row mb-3">
                <label htmlFor="duration" className="col-12 mb-2">
                  Duration
                </label>
                <span id="duration" className="col-2">
                  <label>Hours</label>
                  <input
                    className="border border-success"
                    type="number"
                    id="duration_hours"
                    min={0}
                    max={24}
                    defaultValue={
                      examInfo.examData.duration
                        ? examInfo.examData.duration.substring(0, 2)
                        : ""
                    }
                  />
                </span>
                <span id="duration" className="col-2">
                  <label>Minutes</label>
                  <input
                    className="border border-success"
                    type="number"
                    id="duration_minutes"
                    min={0}
                    max={59}
                    defaultValue={
                      examInfo.examData.duration
                        ? examInfo.examData.duration.substring(3, 5)
                        : ""
                    }
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            {userCtx.examId && (
              <div className="mx-2 mb-2 mt-0">
                <Link to="/preview-exam">
                  <button type="button" className="btn btn-secondary">
                    Preview Exam
                  </button>
                </Link>
              </div>
            )}
            <div className="d-flex flex-row justify-content-end">
              <button className="btn btn-success mx-2 mb-2 mt-0">Save</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditExamInfo;
