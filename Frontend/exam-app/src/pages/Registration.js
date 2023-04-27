import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";

import Register from "../components/Register";
import UserContext from "../store/user-context";
import { post } from "../utils/Fetch";

function RegistrationPage() {
  const userCtx = useContext(UserContext);
  const history = useNavigate();

  let registerHandler = async (registerData) => {
    console.log(registerData);
    const req =
      userCtx.type === "student" ? "studentregister" : "examinerregister";
    let response = await post("http://localhost:8000/users/" + req, registerData);
    let data = await response.json();
    if (response.status === 201) {
      history("/welcome");
    } else if (data.email !== undefined) {
      let message = "Another " + userCtx.type + " with this email already exists.";
      alert(message);
    } else if (data.username !== undefined) {
      alert("A user with that username already exists.");
    } else {
      alert("Registration failed.");
    }
  };

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
                  <h3 className="card-title">Sign-Up</h3>
                  <br />
                  <Register onRegister={registerHandler} />
                  <div className="text-center">
                    <Link to="/welcome">Already have an account?</Link>
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

export default RegistrationPage;
