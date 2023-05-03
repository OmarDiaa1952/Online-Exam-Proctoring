import classes from "./SearchCourses.module.css";

function SearchCourses(props) {
  function textChangeHandler(e) {
    console.log(e.target.value);
    props.onChange(e.target.value);
  }
  return (
    <section>
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Course name or ID"
          type="text"
          id="search"
          onChange={textChangeHandler} />
        <div className="input-group-append">
          <span className="input-group-text">&#128269;</span>
        </div>
      </div>
    </section>
  );
}

export default SearchCourses;
