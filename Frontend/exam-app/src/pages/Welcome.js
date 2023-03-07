import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import Login from "../components/Login";
import UserContext from "../store/user-context";

function WelcomePage() {
  const userCtx = useContext(UserContext);
  userCtx.setCourseId(null);
  userCtx.setExamId(null);
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
