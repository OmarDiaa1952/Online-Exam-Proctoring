import { useContext, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";

import classes from "./Register.module.css";
import UserContext from "../store/user-context";

function Register(props) {
  const [userType, setUserType] = useState(() =>
    localStorage.getItem("userType")
      ? localStorage.getItem("userType")
      : "student"
  );
  useEffect(() => {
    userCtx.type === "student"
      ? userCtx.setUserType("student")
      : userCtx.setUserType("examiner");
  }, []);

  const userCtx = useContext(UserContext);

  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;
    const enteredFirstName = firstNameInputRef.current.value;
    const enteredLastName = lastNameInputRef.current.value;

    let registrationData = {
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
      first_name: enteredFirstName,
      last_name: enteredLastName,
    };
    let errorMessages = [];
    if (enteredPassword !== enteredConfirmPassword) {
      errorMessages.push("Passwords do not match");
    }
    if (enteredPassword.length < 8) {
      errorMessages.push("Password must be at least 8 characters long");
    }
    if (enteredUsername.length < 4) {
      errorMessages.push("Username must be at least 4 characters long");
    }
    if (enteredFirstName.length < 3) {
      errorMessages.push("First name must be at least 3 characters long");
    }
    if (enteredLastName.length < 3) {
      errorMessages.push("Last name must be at least 3 characters long");
    }
    if (enteredEmail.length < 5) {
      errorMessages.push("Email must be at least 5 characters long");
    }
    if (enteredUsername.length > 20) {
      errorMessages.push("Username must be at most 20 characters long");
    }
    if (enteredFirstName.length > 20) {
      errorMessages.push("First name must be at most 20 characters long");
    }
    if (enteredLastName.length > 20) {
      errorMessages.push("Last name must be at most 20 characters long");
    }
    if (enteredEmail.length > 50) {
      errorMessages.push("Email must be at most 50 characters long");
    }
    if (enteredPassword.length > 50) {
      errorMessages.push("Password must be at most 50 characters long");
    }
    if (enteredConfirmPassword.length > 50) {
      errorMessages.push("Confirm password must be at most 50 characters long");
    }
    if (enteredUsername.includes(" ")) {
      errorMessages.push("Username cannot contain spaces");
    }
    if (enteredFirstName.includes(" ")) {
      errorMessages.push("First name cannot contain spaces");
    }
    if (enteredLastName.includes(" ")) {
      errorMessages.push("Last name cannot contain spaces");
    }
    if (enteredEmail.includes(" ")) {
      errorMessages.push("Email cannot contain spaces");
    }
    if (!enteredEmail.includes("@")) {
      errorMessages.push("Email must contain @");
    }
    if (errorMessages.length === 0) {
      swal({
        title: "Success!",
        text: "Registration successful",
        icon: "success",
        button: "Ok!",
      });
      props.onRegister(registrationData);
    } else {
      swal({
        title: "Failed!",
        text: errorMessages.join("\n"),
        icon: "warning",
        button: "Ok!",
      });
    }
  }

  return (
    <div className="container">
      {/* Radio buttons part */}
      <div className="row mb-3">
        <div className="col">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="student"
              name="user-type"
              value="student"
              defaultChecked={userType === "student"}
              onClick={() => {
                userCtx.setUserType("student");
              }}
            />
            <label htmlFor="student" className="form-check-label">
              Student
            </label>
          </div>
        </div>
        <div className="col">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="examiner"
              name="user-type"
              value="examiner"
              defaultChecked={userType === "examiner"}
              onClick={() => {
                userCtx.setUserType("examiner");
              }}
            />
            <label htmlFor="examiner" className="form-check-label">
              Examiner
            </label>
          </div>
        </div>
      </div>

      {/* Form part */}

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input type="text" className="form-control" required id="name" ref={usernameInputRef} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="text" className="form-control" required id="email" ref={emailInputRef} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            required
            id="password"
            ref={passwordInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            className="form-control"
            type="password"
            required
            id="confirm-password"
            ref={confirmPasswordInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="first-name">First Name</label>
          <input
            className="form-control"
            type="text"
            required
            id="first-name"
            ref={firstNameInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Last Name</label>
          <input
            className="form-control"
            type="text"
            required
            id="last-name"
            ref={lastNameInputRef}
          />
        </div>
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
