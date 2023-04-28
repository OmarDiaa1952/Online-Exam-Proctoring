import { useContext, useState, useEffect } from "react";

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
    <div>
      {true && (
        <form onSubmit={props.onSave}>
          <div>
            <label htmlFor="name">Exam Name</label>
            <input
              type="text"
              id="name"
              defaultValue={examInfo.examData.name ? examInfo.examData.name : ""}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="5"
              defaultValue={examInfo.examData.description ? examInfo.examData.description : ""}
            />
          </div>
          <div className="card bg-light">
            <div className="card-body">
              <div className="row mb-3">
                <span className="col">
                  <label htmlFor="exam_start_date" className="col">Start Date</label>
                  <input
                    className="col"
                    type="date"
                    id="exam_start_date"
                    defaultValue={examInfo.examData.exam_start_date ? examInfo.examData.exam_start_date.substring(
                      0,
                      10
                    ) : ""}
                  />
                </span>
                <span className="col">
                  <label htmlFor="exam_start_time" className="col">Start Time</label>
                  <input
                    className="col"
                    type="time"
                    id="exam_start_time"
                    defaultValue={examInfo.examData.exam_start_date ? examInfo.examData.exam_start_date.substring(
                      11,
                      16
                    ) : ""}
                  />
                </span>
              </div>
              <div className="row mb-3">
                <span className="col">
                  <label htmlFor="exam_end_date" className="col">End Date</label>
                  <input
                    className="col"
                    type="date"
                    id="exam_end_date"
                    defaultValue={examInfo.examData.exam_end_date ? examInfo.examData.exam_end_date.substring(0, 10) : ""}
                  />
                </span>
                <span className="col">
                  <label htmlFor="exam_end_time" className="col">End Time</label>
                  <input
                    className="col"
                    type="time"
                    id="exam_end_time"
                    defaultValue={examInfo.examData.exam_end_date ? examInfo.examData.exam_end_date.substring(11, 16) : ""}
                  />
                </span>
              </div>
              <div className="row mb-3">
                <label htmlFor="duration" className="col-2">Duration</label>
                <span id="duration">
                <input
                  className="col-2"
                  type="number"
                  id="duration_hours"
                  min={0}
                  max={24}
                  defaultValue={examInfo.examData.duration ? examInfo.examData.duration.substring(0, 2) : ""}
                />
                </span>
                <span id="duration">
                <input
                  className="col-2"
                  type="number"
                  id="duration_minutes"
                  min={0}
                  max={59}
                  defaultValue={examInfo.examData.duration ? examInfo.examData.duration.substring(3, 5) : ""}
                />
                </span>
              </div>
            </div>
          </div>
          <div>
            <button>Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditExamInfo;
