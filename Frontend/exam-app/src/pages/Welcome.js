import { Link } from "react-router-dom";

import Login from "../components/Login";

function WelcomePage() {

  return (
    <div>
      <h1>WEBSITE NAME</h1>
      <p>WEBSITE DESCRIPTION</p>
      <Login />
      <div>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
