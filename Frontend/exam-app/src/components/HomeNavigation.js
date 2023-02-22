import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./HomeNavigation.module.css";
import UserContext from "../store/user-context";

function HomeNavigation() {
  const userType = useContext(UserContext);
  return (
    <div>
      <section>
        <h2>My Courses</h2>
      </section>
      {(userType.type === "student") && <section>
        <h2>Join Courses</h2>
      </section>}
      {(userType.type === "examiner") && <div>
        <button>
          <Link to="/modify-course">Add Course</Link>
        </button>
      </div>}
      <div>
        <button>
          <Link to="/">Logout</Link>
        </button>
      </div>
    </div>
  );
}

export default HomeNavigation;
