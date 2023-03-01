import { useContext } from "react";

import classes from "./Login.module.css";
import UserContext from "../store/user-context";


function Login() {
  const userCtx = useContext(UserContext);

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
      <form onSubmit={userCtx.loginUser}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" required id="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            id="password"
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
