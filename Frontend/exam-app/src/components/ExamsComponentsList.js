import classes from "./ExamsComponentsList.module.css";
import ExamComponent from "./ExamComponent";

function ExamsComponentsList(props) {
  return (
    <div className="container testimonial-group">
        <h2>Course Exams:</h2>
      <ul className="row text-center flex-nowrap">
        {props.components.map((component) => {
          return (
            <ExamComponent
              key={component.id}
              id={component.id}
              course_id={component.course_id}
              description={component.description}
              duration={component.duration}
              exam_end_date={component.exam_end_date}
              exam_start_date={component.exam_start_date}
              max_grade={component.max_grade}
              name={component.name}
              onDelete={props.onDelete}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default ExamsComponentsList;
