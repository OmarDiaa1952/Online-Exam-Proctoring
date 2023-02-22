import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <section>
        <h2>My Courses</h2>
      </section>
      <section>
        <h2>Join Courses</h2>
      </section>
      <div>
        <button>Add Course</button>
      </div>
      <div>
        <button><Link to="/">Logout</Link></button>
      </div>
    </div>
  );
}

export default HomePage;
