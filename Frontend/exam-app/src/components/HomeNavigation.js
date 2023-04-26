import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./HomeNavigation.module.css";
import UserContext from "../store/user-context";
import GetCourses from "./GetCourses";

function HomeNavigation(props) {
  const userCtx = useContext(UserContext);
  return (
    <div>
      <div>
        <Link to="/profile">
          <button>
            Profile
          </button>
        </Link>
      </div>
      <GetCourses
        coursesData={props.myCourses}
        requestType="getMyCourses"
        onChangeSearchText={props.onChangeSearchText}
      />
      {userCtx.type === "student" && (
        <GetCourses
          // enrollmentStatus={props.enrollmentStatus}
          // findEnrollmentStatus={props.findEnrollmentStatus}
          onChangeSearchText={props.onSearchNewCourses}
          coursesData={props.allCourses}
          requestType="getNewCourses"
        />
      )}
      {userCtx.type === "examiner" && (
        <div>
          <Link to="/modify-course">
            <button>
              Add Course
            </button>
          </Link>
        </div>
      )}
      <div>
        <button onClick={() => userCtx.logoutUser()}>Logout</button>
      </div>
    </div>
  );
}

export default HomeNavigation;
