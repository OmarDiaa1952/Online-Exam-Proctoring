import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import Login from "../components/Login";
import UserContext from "../store/user-context";

function WelcomePage() {
  const userCtx = useContext(UserContext);
  useEffect(() => {
    userCtx.setUserType(null);
  }, []);
  return (
    <div>
      <section className="mt-5 background-img container-fluid flex-row">
        <div className="row">
          <div className="col-2"></div>
        <div className="container-fluid h-custom col-10">
          <div className="row d-flex justify-content-start align-items-start h-25 flex-column"></div>
          <div className="row d-flex justify-content-start align-items-start h-100 flex-column">
            <div className="col-5">
              <h1 className="text-success">PROCTOBOT</h1>
              <p>WEBSITE DESCRIPTION</p>
            </div>
            <div className="col-5">
              <div className="card bg-light border border-success">
                <div className="card-body">
                  <h3 className="card-title text-success">Login</h3>
                  <br />
                  <Login />
                  <div>
                    <p className="text-center">
                      Don't have an account?{" "}
                      <Link to="/register" className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Register</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div>
      </section>
    </div>
  );
}

export default WelcomePage;
