import { useState } from "react";
import { Link } from "react-router-dom";

import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";

function LogFilePage() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <h1>Log File</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Grade</th>
                  <th>Cheating Instances</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>
                    <a href="mailto:    "> </a>
                  </td>
                  <td>2021-06-01 20:00:00</td>
                  <td>2021-06-01 21:10:00</td>
                  <td>100</td>
                  <td>2021-06-01 20:00:00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div>
              <Link to="/preview-exam">
                <button type="button">Back</button>
              </Link>
            </div>
            <div>
              <Link to={"/"}>
                <button type="button">Home</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogFilePage;

// This page contains a list of all the students in this course with the
// following data for each of them: student name, email, the date at which the student
// started the exam and ended, the grade, and the dates of the cheating instances suspects.
// The page also has a back button and a home page button.
// • If the back button is pressed, the examiner is directed back to the Preview Exam page.
// • If the home page button is pressed, the examiner returns to the home page
