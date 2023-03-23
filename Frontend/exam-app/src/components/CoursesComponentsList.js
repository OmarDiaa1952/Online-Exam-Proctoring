import classes from "./CoursesComponentsList.module.css";
import CourseComponent from "./CourseComponent";

function CoursesComponentsList(props) {
  return (
    <div>
      <ul>
        {props.coursesData.map((courseData) => (
          <CourseComponent
            courseData={courseData}
            key={courseData.id}
            // findEnrollmentStatus={props.findEnrollmentStatus}
            // enrollmentStatus={props.enrollmentStatus}
          />
        ))}
      </ul>
    </div>
  );
}

export default CoursesComponentsList;
