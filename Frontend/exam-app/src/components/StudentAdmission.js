import { useRef } from "react";

import classes from "./StudentAdmission.module.css";

function StudentAdmission(props) {
  const studentEmailInputRef = useRef();

  const removeHandler = () => {
    console.log("Remove");
  };
  const approveHandler = () => {
    console.log("Approve");
  };
  const declineHandler = () => {
    console.log("Decline");
  };
  const approveAllHandler = () => {
    console.log("Approve All");
  };
  const addStudentHandler = (event) => {
    event.preventDefault();
    const enteredStudentEmail = studentEmailInputRef.current.value;
    let studentData = {
      requestType: "addStudent",
      studentEmail: enteredStudentEmail,
    };
    props.onAddStudent(studentData);
  };

  return (
    <div>
      <div>
        <h2>Add Student:</h2>
        <form onAdd={addStudentHandler}>
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
          {props.studentsData.enrolledStudents.map((student) => (
            <li key={student.studentEmail}>
              <span>{student.studentEmail}</span>
              <span>
                <button onClick={removeHandler}>Remove</button>
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
            {props.studentsData.pendingStudents.map((student) => (
              <li key={student.studentEmail}>
                <span>{student.studentEmail}</span>
                <span>
                  <button onClick={approveHandler}>Approve</button>
                </span>
                <span>
                  <button onClick={declineHandler}>Decline</button>
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
