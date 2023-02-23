import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./HomeNavigation.module.css";
import UserContext from "../store/user-context";
import GetCourses from "./GetCourses";

function HomeNavigation(props) {
  const userCtx = useContext(UserContext);
  return (
    <div>
      <GetCourses coursesData={props.coursesData} requestType="getMyCourses" />
      {userCtx.type === "student" && <GetCourses coursesData={props.coursesData} requestType="getNewCourses" />}
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
