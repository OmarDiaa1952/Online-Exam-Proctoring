import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";

import Register from "../components/Register";
import UserContext from "../store/user-context";

function RegistrationPage() {
  const userCtx = useContext(UserContext);
  const history = useNavigate();

  function registerHandler(registerData) {
    const req =
      userCtx.type === "student" ? "studentregister" : "examinerregister";

    fetch("http://localhost:8000/users/" + req, {
      method: "POST",
      body: JSON.stringify(registerData.mainData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        if (req === "studentregister") {
          fetch("http://localhost:8000/users/photoupload", {
            method: "PUT",
            body: JSON.stringify(registerData.imageDataURL),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      })
      .then(() => {
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
