import { Link } from "react-router-dom";

import Login from "../components/Login";

function WelcomePage() {

  return (
    <div>
      <section className="mt-5">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-6">
              <h1>WEBSITE NAME</h1>
              <p>WEBSITE DESCRIPTION</p>
            </div>
            <div className="col-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="card-title">Login</h3>
                  <br/>
                  <Login />
                  <div>
                    <p className="text-center">
                      Don't have an account?{" "}
                      <Link to="/register" >
                        Register
                      </Link>
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
