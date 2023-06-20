import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PopupMenu } from "react-simple-widgets";

import classes from "./NavBar.module.css";
import UserContext from "../store/user-context";

function NavBar() {
  const proctobotSpan1 = (
    <span>
      <span className="text-success">P</span>
      <span className="text-light">ROCTO</span>
      <span className="text-success">B</span>
      <span className="text-light">OT</span>
    </span>
  );
  const proctobotSpan2 = (
    <span>
      <span className="text-success">P</span>
      <span className="text-warning">ROCTO</span>
      <span className="text-success">B</span>
      <span className="text-warning">OT</span>
    </span>
  );
  const userCtx = useContext(UserContext);
  const [proctobotSpan, setProctobotSpan] = useState(proctobotSpan1);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light nav-fill w-100 container-fluid flex-row sticky-top">
      <div className="container-fluid col-2">
        <a className="navbar-brand" href="/">
          <h1
            onMouseEnter={() => setProctobotSpan(proctobotSpan2)}
            onMouseLeave={() => setProctobotSpan(proctobotSpan1)}
          >
            {proctobotSpan}
          </h1>
        </a>
      </div>
      <div className="container-fluid col-1"></div>
      {(userCtx.courseId && userCtx.courseId !== "null") ? (
        <div className="container-fluid col-1">
          <a className="navbar-brand" href="/course-details">
            <h2 className="text-light">
              <span className="green-hover">{userCtx.courseName}</span>
            </h2>
          </a>
        </div>
      ) : (
        <div className="container-fluid col-1"></div>
      )}
      <div className="container-fluid col-1"></div>
      {(userCtx.examId && userCtx.examId !== "null") ? (
        <div className="container-fluid col-1">
          <a
            className="navbar-brand"
            href={
              userCtx.type === "student" ? "/exam-details" : "/preview-exam"
            }
          >
            <h2 className="text-light">
              <span className="green-hover">{userCtx.examName}</span>
            </h2>
          </a>
        </div>
      ) : (
        <div className="container-fluid col-1"></div>
      )}
      <div className="container-fluid col-3"></div>
      <div className="container-fluid col-1">
        <div>
          <div className="text-end">
            <PopupMenu>
              <button className="btn btn-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </button>
              <div className="card text-start">
                <div className="card-body px-4 py-4">
                  <div className="text-center mx-auto mb-4 circle-avatar">
                    <span className="span">Username:</span>
                  </div>
                  <h5 className="text-center mb-0">{userCtx.username}</h5>
                  <hr />
                  <p
                    className="mb-0"
                    style={{
                      color: "#bebebe",
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    Logged in as {userCtx.type}
                  </p>
                  <hr className="mb-0" style={{ margin: "0 -24px 0" }} />
                  <div
                    className="list-group list-group-flush"
                    style={{ margin: "0 -24px 0" }}
                  >
                    <button
                      className="list-group-item list-group-item-action px-4"
                      onClick={() => navigate("/profile")}
                    >
                      <small>Go to Profile</small>
                    </button>
                  </div>
                  <hr style={{ margin: "0 -24px 24px" }} />
                  <div className="d-grid">
                    <button
                      className="btn btn-secondary"
                      onClick={() => userCtx.logoutUser()}
                    >
                      <small>Logout</small>
                    </button>
                  </div>
                </div>
              </div>
            </PopupMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
