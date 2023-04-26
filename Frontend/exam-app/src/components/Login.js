import { useContext, useEffect } from "react";

import classes from "./Login.module.css";
import UserContext from "../store/user-context";


function Login() {
  const userCtx = useContext(UserContext);
  useEffect(() => {
    userCtx.type === "student" ? userCtx.setUserType("student") : userCtx.setUserType("examiner");
  }, []);

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="student"
              name="user-type"
              value="student"
              defaultChecked
              onClick={() => {
                userCtx.setUserType("student");
              }}
            />
            <label className="form-check-label" htmlFor="student">
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
              onClick={() => {
                userCtx.setUserType("examiner");
              }}
            />
            <label className="form-check-label" htmlFor="examiner">
              Examiner
            </label>
          </div>
        </div>
      </div>
      <form onSubmit={userCtx.loginUser}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" className="form-control" required id="username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" required id="password" />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>

  );
}

export default Login;
