import classes from "./ExamComponentsList.module.css";
import ExamComponent from "./ExamComponent";

function ExamComponentsList(props) {
  return (
    <div>
        <h2>Course Exams:</h2>
      <ul>
        {props.components.map((component) => {
          return (
            <ExamComponent
              key={component.id}
              id={component.id}
              title={component.title}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default ExamComponentsList;
