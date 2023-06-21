import classes from "./ModifyCourseDetails.module.css";

function ModifyCourseDetails(props) {
  let enrollmentStatus = props.courseDetails.status==="open" ? true : false;
  console.log(enrollmentStatus);
  return (
    <form onSubmit={props.onSave}>
      <div className="card bg-light mb-5 border border-success">
        <div className="card-body">
        <div className="form-group">
        <label htmlFor="name">Course Name</label>
        <input type="text" id="name" defaultValue={props.courseDetails.name} className="form-control border border-success"/>
      </div>
      {props.courseDetails.id && (
        <div className="form-group">
          <label htmlFor="course-id">Course ID</label>
          <input
            className="form-control border border-success"
            type="text"
            id="course-id"
            disabled
            defaultValue={props.courseDetails.id}
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          className="form-control border border-success"
          id="description"
          rows="5"
          defaultValue={props.courseDetails.description}
        />
      </div>
      <div>
        <div className="form-check">
          <input
            className="form-check-input border border-success"
            type="radio"
            id="open"
            name="enrollment"
            value="open"
            defaultChecked={enrollmentStatus}
          />
          <label htmlFor="open" className="form-check-label">Open</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input border border-success"
            type="radio"
            id="closed"
            name="enrollment"
            value="closed"
            defaultChecked={!enrollmentStatus}
          />
          <label htmlFor="closed" className="form-check-label">Closed</label>
        </div>
      </div>
      <div>
        <button type="submit" className="btn btn-success">Save</button>
      </div>
        </div>
      </div>
    </form>
  );
}

export default ModifyCourseDetails;
