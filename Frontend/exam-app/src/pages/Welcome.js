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
      <section className="mt-5 background-img">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-6">
              <h1 className="text-success">PROCTOBOT</h1>
              <p>WEBSITE DESCRIPTION</p>
            </div>
            <div className="col-6">
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
        </div>
      </section>
    </div>
  );
}

export default WelcomePage;
