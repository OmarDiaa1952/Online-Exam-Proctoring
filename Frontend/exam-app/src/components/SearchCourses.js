import classes from "./SearchCourses.module.css";

function SearchCourses(props) {
  function textChangeHandler(e) {
    console.log(e.target.value);
    props.onChange(e.target.value);
  }
  return (
    <section>
      <div>
        <label htmlFor="search">Search:</label>
        <input type="text" id="search" onChange={textChangeHandler} />
      </div>
    </section>
  );
}

export default SearchCourses;
