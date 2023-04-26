import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import classes from "./Register.module.css";
import UserContext from "../store/user-context";

function Register(props) {
  const [userType, setUserType] = useState(() =>
    localStorage.getItem("userType")
      ? localStorage.getItem("userType")
      : "student"
  );
  useEffect(() => {
    userCtx.type === "student" ? userCtx.setUserType("student") : userCtx.setUserType("examiner");
  }, []);

  const userCtx = useContext(UserContext);
  const location = useLocation();
  const imageDataURL = location.state;

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
      mainData: {
        username: enteredUsername,
        email: enteredEmail,
        password: enteredPassword,
        first_name: enteredFirstName,
        last_Name: enteredLastName,
      },
      imageDataURL: { photo: imageDataURL },
    };

    props.onRegister(registrationData);
  }
  const history = useNavigate();
  console.log(imageDataURL);
  const useCamera = () => {
    navigator.getUserMedia(
      { audio: true, video: true },
      function (stream) {
        stream.getTracks().forEach((x) => x.stop());
        history("/camera");
      },
      (err) => console.log(err)
    );
  };

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
        {userCtx.type === "student" && (
          <div className="text-center">
            <button type="button" className="btn btn-primary" onClick={useCamera}>
              Camera
            </button>
          </div>
        )}
        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
