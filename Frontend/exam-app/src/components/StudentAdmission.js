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
        <form onSubmit={addStudentHandler}>
          <span>
            <label htmlFor="student-email">Email: </label>
            <input
              type="text"
              required
              id="student-email"
              ref={studentEmailInputRef}
            />
          </span>
          <span>
            <button type="submit">Add</button>
          </span>
        </form>
      </div>
      <div>
        <h2>Enrolled Students:</h2>
        <ol>
          {props.enrolledStudents.map((student) => (
            <li key={student.id}>
              <span>{student.student_name}</span>
              <span>{student.student_email}</span>
              <span>
                <button onClick={()=>{removeHandler(student.id)}}>Remove</button>
              </span>
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
              <li key={student.student_id}>
                <span>{student.student_name}</span>
                <span>{student.student_email}</span>
                <span>
                  <button
                    onClick={() => requestHandler(student.id, "accept")}
                  >
                    Approve
                  </button>
                </span>
                <span>
                  <button
                    onClick={() => requestHandler(student.id, "reject")}
                  >
                    Decline
                  </button>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default StudentAdmission;
