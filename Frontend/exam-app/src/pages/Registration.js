import { useNavigate } from "react-router-dom";

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
      console.log(registerData);
      history("/");
    });
  }

  return (
    <div>
      <Register onRegister={registerHandler} />
    </div>
  );
}

export default RegistrationPage;
