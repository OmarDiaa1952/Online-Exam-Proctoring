import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";

import Register from "../components/Register";
import UserContext from "../store/user-context";
import { post, put } from "../utils/Fetch";

function RegistrationPage() {
  const userCtx = useContext(UserContext);
  const history = useNavigate();

  let registerHandler = async (registerData) => {
    console.log(registerData);
    const req =
      userCtx.type === "student" ? "studentregister" : "examinerregister";
    let response = await post("http://localhost:8000/users/" + req, registerData.mainData);
    let data = await response.json();
    if (response.status === 201) {
      if (req === "studentregister") {
        put("http://localhost:8000/users/photoupload", registerData.imageDataURL);
      }
      history("/welcome");
    } else if(data.email !== undefined) {
      let message = "Another " + userCtx.type + " with this email already exists.";
      alert(message);
    } else if(data.username !== undefined) {
      alert("A user with that username already exists.");
    } else {
      alert("Registration failed.");
    }
  };

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
