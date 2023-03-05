import { useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import classes from "./Register.module.css";
import UserContext from "../store/user-context";
// import { Link } from "react-router-dom";

function Register(props) {
  const userCtx = useContext(UserContext);
  const location = useLocation();
  const imageDataURL = location.state;

  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    let registrationData = {
      mainData: {
        username: enteredUsername,
        email: enteredEmail,
        password: enteredPassword,
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
    <div>
      <div>
        <div>
          <input
            type="radio"
            id="student"
            name="user-type"
            value="student"
            defaultChecked
            onClick={() => {
              userCtx.setUserType("student");
            }}
          />
          <label htmlFor="student">Student</label>
        </div>
        <div>
          <input
            type="radio"
            id="examiner"
            name="user-type"
            value="examiner"
            onClick={() => {
              userCtx.setUserType("examiner");
            }}
          />
          <label htmlFor="examiner">Examiner</label>
        </div>
      </div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" required id="name" ref={usernameInputRef} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" required id="email" ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            id="password"
            ref={passwordInputRef}
          />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            required
            id="confirm-password"
            ref={confirmPasswordInputRef}
          />
        </div>
        {userCtx.type === "student" && (
          <div>
            <button type="button" onClick={useCamera}>
              Camera
            </button>
          </div>
        )}
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
