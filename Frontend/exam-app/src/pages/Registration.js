import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";

import Register from "../components/Register";
import UserContext from "../store/user-context";

function RegistrationPage() {
  const userCtx = useContext(UserContext);
  console.log("Registration successful!");
  const history = useNavigate();

  function registerHandler(registerData) {
    const req =
      userCtx.type === "student" ? "studentregister" : "examinerregister";

    console.log("Registration successful!");
    fetch("http://localhost:8000/users/" + req, {
      method: "POST",
      body: JSON.stringify(registerData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      console.log(JSON.stringify(registerData));
      history("/welcome");
    });
  }

  return (
    <div>
      <Register onRegister={registerHandler} />
      <div>
        <Link to="/welcome">Already have an account?</Link>
      </div>
    </div>
  );
}

export default RegistrationPage;
