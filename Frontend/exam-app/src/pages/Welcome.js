import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Login from "../components/Login";

function WelcomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    window.onpopstate = (e) => {
      navigate("/");
    };
  });

  function loginHandler(loginData) {
    fetch(
      "https://react-getting-started-59f1b-default-rtdb.firebaseio.com/data.json",
      {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      navigate("/home");
    });
  }
  return (
    <div>
      <h1>WEBSITE NAME</h1>
      <p>WEBSITE DESCRIPTION</p>
      <Login onLogin={loginHandler} />
      <div>
        <button>
          <Link to="/register">Register</Link>
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
