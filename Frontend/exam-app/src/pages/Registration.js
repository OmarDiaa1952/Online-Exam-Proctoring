import { useNavigate, Link } from "react-router-dom";

import Register from "../components/Register";

function RegistrationPage() {
  const history = useNavigate();

  function registerHandler(registerData) {
    fetch(
      "https://react-getting-started-59f1b-default-rtdb.firebaseio.com/data.json",
      {
        method: "POST",
        body: JSON.stringify(registerData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      history("/");
    });
  }

  return (
    <div>
      <Register onRegister={registerHandler} />
      <div>
        <Link to="/">Already have an account?</Link>
      </div>
    </div>
  );
}

export default RegistrationPage;
