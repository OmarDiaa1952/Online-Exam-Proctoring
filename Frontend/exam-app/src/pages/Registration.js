import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import Register from "../components/Register";
import UserContext from "../store/user-context";
import { post } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";

function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const userCtx = useContext(UserContext);
  const history = useNavigate();

  let registerHandler = async (registerData) => {
    console.log(registerData);
    setIsLoading(true);
    const req =
      userCtx.type === "examiner" ? "examinerregister" : "studentregister";
    let response = await post(BASEURL + "/users/" + req, registerData);
    let data = await response.json();
    if (response.status === 201) {
      history("/welcome");
    } else if (data.email !== undefined) {
      let message =
        "Another " + userCtx.type + " with this email already exists.";
      alert(message);
    } else if (data.username !== undefined) {
      alert("A user with that username already exists.");
    } else {
      alert("Registration failed.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
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
                    <h3 className="card-title text-success">Sign-Up</h3>
                    <br />
                    <Register onRegister={registerHandler} />
                    <div className="text-center">
                      <Link to="/welcome" className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Already have an account?</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default RegistrationPage;
