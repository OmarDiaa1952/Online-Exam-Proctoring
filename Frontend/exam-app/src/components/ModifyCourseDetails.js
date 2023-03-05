import classes from "./ModifyCourseDetails.module.css";

function ModifyCourseDetails(props) {

  return (
    <form onSubmit={props.onSave} >
      <div>
        <label htmlFor="name">Course Name</label>
        <input type="text" id="name" defaultValue={props.courseDetails.name} />
      </div>
      <div>
        <label htmlFor="id">Course Id</label>
        <input type="text" id="id" value={props.courseDetails.id} readonly="true" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" rows="5" defaultValue={props.courseDetails.description} />
      </div>
      <div>
        <div>
          <input
            type="radio"
            id="open"
            name="enrollment"
            value="open"
            defaultChecked
          />
          <label htmlFor="open">Open</label>
        </div>
        <div>
          <input type="radio" id="closed" name="enrollment" value="closed" />
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
