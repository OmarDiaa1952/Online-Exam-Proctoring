import { useContext, useRef } from "react";

import classes from "./Register.module.css";
import UserContext from "../store/user-context";

function Register(props) {
  const userTypeCtx = useContext(UserContext);

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    let registrationData = {
      requestType: "register",
      userType: userTypeCtx.type,
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
    };

    props.onRegister(registrationData);
  }

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
              userTypeCtx.setUserType("student");
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
              userTypeCtx.setUserType("examiner");
            }}
          />
          <label htmlFor="examiner">Examiner</label>
        </div>
      </div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" required id="name" ref={nameInputRef} />
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
        {userTypeCtx.type === "student" && (
          <div>
            <button type="button">Camera</button>
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
