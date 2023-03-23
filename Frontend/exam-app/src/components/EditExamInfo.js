import { useContext, useState, useEffect } from "react";

import classes from "./EditExamInfo.module.css";
import UserContext from "../store/user-context";

function EditExamInfo(props) {
  // const [loaded, setLoaded] = useState(false);
  // const [firstLoad, setFirstLoad] = useState(true);
  // useEffect(() => {
  //   if (!firstLoad) {
  //     console.log("loaded");
  //     setLoaded(true);
  //     setFirstLoad(false);
  //   }
  // }, [props.examData.name]);

  console.log(props);

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
          <div>
            <span>
              <label htmlFor="exam_start_date">Start Date</label>
              <input
                type="date"
                id="exam_start_date"
                defaultValue={examInfo.examData.exam_start_date ? examInfo.examData.exam_start_date.substring(
                  0,
                  10
                ) : ""}
              />
            </span>
            <span>
              <label htmlFor="exam_start_time">Start Time</label>
              <input
                type="time"
                id="exam_start_time"
                defaultValue={examInfo.examData.exam_start_date ? examInfo.examData.exam_start_date.substring(
                  11,
                  16
                ) : ""}
              />
            </span>
          </div>
          <div>
            <span>
              <label htmlFor="exam_end_date">End Date</label>
              <input
                type="date"
                id="exam_end_date"
                defaultValue={examInfo.examData.exam_end_date ? examInfo.examData.exam_end_date.substring(0, 10) : ""}
              />
            </span>
            <span>
              <label htmlFor="exam_end_time">End Time</label>
              <input
                type="time"
                id="exam_end_time"
                defaultValue={examInfo.examData.exam_end_date? examInfo.examData.exam_end_date.substring(11, 16) : ""}
              />
            </span>
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              type="time"
              id="duration"
              defaultValue={examInfo.examData.duration ? examInfo.examData.duration.substring(0, 5) : ""}
            />
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
