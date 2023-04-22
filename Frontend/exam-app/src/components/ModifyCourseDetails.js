import classes from "./ModifyCourseDetails.module.css";

function ModifyCourseDetails(props) {
  let enrollmentStatus = props.courseDetails.status==="open" ? true : false;
  console.log(enrollmentStatus);
  return (
    <form onSubmit={props.onSave}>
      <div>
        <label htmlFor="name">Course Name</label>
        <input type="text" id="name" defaultValue={props.courseDetails.name} />
      </div>
      {props.courseDetails.id && (
        <div>
          <label htmlFor="course-id">Course ID</label>
          <input
            type="text"
            id="course-id"
            defaultValue={props.courseDetails.id}
          />
        </div>
      )}
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows="5"
          defaultValue={props.courseDetails.description}
        />
      </div>
      <div>
        <div>
          <input
            type="radio"
            id="open"
            name="enrollment"
            value="open"
            defaultChecked={enrollmentStatus}
          />
          <label htmlFor="open">Open</label>
        </div>
        <div>
          <input
            type="radio"
            id="closed"
            name="enrollment"
            value="closed"
            defaultChecked={!enrollmentStatus}
          />
          <label htmlFor="closed">Closed</label>
        </div>
      </div>
      <div>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default ModifyCourseDetails;
