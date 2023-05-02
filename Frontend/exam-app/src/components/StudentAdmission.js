import { useRef } from "react";

import classes from "./StudentAdmission.module.css";

function StudentAdmission(props) {
  const studentEmailInputRef = useRef();

  const removeHandler = (id) => {
    props.onRemoveStudent(id);
  };
  const requestHandler = (request_id, requestType) => {
    console.log(requestType);
    props.onJoinRequest(request_id, requestType);
  };
  const approveAllHandler = () => {
    console.log("Approve All");
  };
  const addStudentHandler = (e) => {
    e.preventDefault();
    props.onAddStudent(studentEmailInputRef.current.value);
  };

  return (
    <div>
      <div>
        <h2>Add Student:</h2>
        <form onSubmit={addStudentHandler} className="form-group">
          <div>
            <label htmlFor="student-email">Email: </label>
            <div class="input-group mb-3">
              <input
                className="form-control"
                placeholder="Enter student email"
                type="text"
                required
                id="student-email"
                ref={studentEmailInputRef}
              />
              <button type="submit" className="input-group-append btn btn-success">Add</button>
              {/* <div className="input-group-append">
                <button type="submit" className="btn btn-success">Add</button>
              </div> */}
            </div>
          </div>
        </form>
      </div>
      <div>
        <h2>Enrolled Students:</h2>
        <ol>
          {props.enrolledStudents.map((student) => (
            <li key={student.id} className="card bg-light mb-3">
              <div className="card-body row">
                <span className="col">{"Name: "}{student.student_name}</span>
                <span className="col">{" Email: "}{student.student_email}</span>
                <span className="col">
                  <button onClick={() => { removeHandler(student.id) }} className="btn btn-danger">Remove</button>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <div>
          <h2>Pending Students:</h2>
          <div>
            <button onClick={approveAllHandler}>Approve All</button>
          </div>
          <ol>
            {props.enrollmentRequests.map((student) => (
              <li key={student.student_id} className="card bg-light-25 mb-3">
                <div className="card-body row">
                  <span className="col">{"Name: "}{student.student_name}</span>
                  <span className="col">{"Email: "}{student.student_email}</span>
                  <span className="col">
                    <button
                      className="btn btn-success"
                      onClick={() => requestHandler(student.id, "accept")}
                    >
                      Approve
                    </button>
                  </span>
                  <span className="col">
                    <button
                      className="btn btn-danger"
                      onClick={() => requestHandler(student.id, "reject")}
                    >
                      Decline
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default StudentAdmission;
