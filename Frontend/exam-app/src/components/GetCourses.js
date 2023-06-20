import classes from "./GetCourses.module.css";
import CoursesComponentsList from "./CoursesComponentsList";
import SearchCourses from "./SearchCourses";

function GetCourses(props) {
  return (
    <section className="pl-10 mt-100">
      <div className="card bg-light bg-opacity-25 mb-3 mt-100">
        <div className="card-body ml-10">
          <h2 className="text-success">
            {props.requestType === "getNewCourses"
              ? "Search new Courses:"
              : "Search my Courses:"}
          </h2>
          <SearchCourses onChange={props.onChangeSearchText} />
        </div>
      </div>

      <CoursesComponentsList
        coursesData={props.coursesData}
      // findEnrollmentStatus={props.findEnrollmentStatus}
      // enrollmentStatus={props.enrollmentStatus}
      />
      <div className="m-5">
        <hr/>
      </div>
    </section>
  );
}

export default GetCourses;
