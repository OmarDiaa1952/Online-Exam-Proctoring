import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./HomeNavigation.module.css";
import UserContext from "../store/user-context";
import MyCourses from "./MyCourses";
import JoinCourses from "./JoinCourses";

function HomeNavigation() {
  const userCtx = useContext(UserContext);
  return (
    <div>
      <MyCourses />
      {userCtx.type === "student" && <JoinCourses />}
      {userCtx.type === "examiner" && (
        <div>
          <button>
            <Link to="/modify-course">Add Course</Link>
          </button>
        </div>
      )}
      <div>
        <button>
          <Link to="/">Logout</Link>
        </button>
      </div>
    </div>
  );
}

export default HomeNavigation;
