import { useContext, useEffect } from "react";

import classes from "./Login.module.css";
import UserContext from "../store/user-context";


function Login() {
  const userCtx = useContext(UserContext);

  return (
    <div className="container">
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
