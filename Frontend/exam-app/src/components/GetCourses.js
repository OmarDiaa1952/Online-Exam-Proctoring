import classes from "./GetCourses.module.css";
import CoursesComponentsList from "./CoursesComponentsList";
import SearchCourses from "./SearchCourses";

function GetCourses(props) {
  return (
    <section>
      <h2>Search Courses:</h2>
      <SearchCourses />
      <h2>{props.requestType === "GetNewCourses" ? "Join new Courses:" : "My Courses"}</h2>
      <CoursesComponentsList coursesData={props.coursesData} />
    </section>
  );
}

export default GetCourses;
