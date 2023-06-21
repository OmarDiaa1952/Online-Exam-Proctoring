import classes from "./CourseInfo.module.css";

function CourseInfo(props) {
  return (
    <div>
      <div className="card bg-light mb-5 border border-success m-3">
        <div className="card-body">
          <section>
            <h2 className="card-title">Course Info</h2>
            <table className="table table-sm">
              <tbody>
                <tr>
                  <th className="cell" scope="row">Course Name: </th>
                  <td className="cell">{props.courseData.name}</td>
                </tr>
                <tr>
                  <th className="cell" scope="row">Course ID: </th>
                  <td className="cell">{props.courseData.id}</td>
                </tr>
                <tr>
                  <th className="cell" scope="row">Examiner: </th>
                  <td className="cell">{props.courseData.examiner}</td>
                </tr>
                <tr>
                  <th className="cell" scope="row">Description: </th>
                  <td className="cell prewrap">{props.courseData.description}</td>
                </tr>
                </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CourseInfo;
