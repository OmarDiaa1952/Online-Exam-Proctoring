import { Link } from "react-router-dom";
import { useContext } from "react";

import classes from "./HomeNavigation.module.css";
import UserContext from "../store/user-context";
import GetCourses from "./GetCourses";

function HomeNavigation(props) {
  const userCtx = useContext(UserContext);
  return (
    <div>
      <GetCourses
        coursesData={props.coursesData}
        requestType="getMyCourses"
        onChangeSearchText={props.onChangeSearchText}
        searchResult={props.searchResult}
      />
      {userCtx.type === "student" && (
        <GetCourses
          onChangeSearchText={props.onChangeSearchText}
          coursesData={props.coursesData}
          requestType="getNewCourses"
          searchResult={props.searchResult}
        />
      )}
      {userCtx.type === "examiner" && (
        <div>
          <button>
            <Link to="/modify-course">Add Course</Link>
          </button>
        </div>
      )}
      <div>
        <button onClick={() => userCtx.logoutUser()}>Logout</button>
      </div>
    </div>
  );
}

export default HomeNavigation;
