import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Login from "../components/Login";

function WelcomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    window.onpopstate = (e) => {
      navigate("/welcome");
    };
  });

  return (
    <div>
      <h1>WEBSITE NAME</h1>
      <p>WEBSITE DESCRIPTION</p>
      <Login />
      <div>
        <button>
          <Link to="/register">Register</Link>
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
