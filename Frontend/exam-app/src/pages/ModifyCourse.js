import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import ModifyCourseDetails from "../components/ModifyCourseDetails";
import StudentAdmission from "../components/StudentAdmission";
import UserContext from "../store/user-context";

function ModifyCoursePage() {
  const history = useNavigate();
  const userCtx = useContext(UserContext);
  let [courseDetails, setCourseDetails] = useState([]);
  let [enrollmentRequests, setEnrollmentRequests] = useState([]);
  let [enrolledStudents, setEnrolledStudents] = useState([]);
  let [updateEnrolledStudents, setUpdateEnrolledStudents] = useState(false);
  let [delayCourseDetails, setDelayCourseDetails] = useState(false);

  useEffect(() => {
    getCourseDetails();
    getEnrollmentRequests();
  }, []);

  useEffect(() => {
    getEnrolledStudents();
  }, [updateEnrolledStudents]);

  useEffect(() => {
    console.log(courseDetails);
  }, [delayCourseDetails]);

  let getCourseDetails = async () => {
    if (userCtx.courseId) {
      let response = await fetch(
        "http://localhost:8000/main_app/coursedetail/" + userCtx.courseId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(userCtx.authTokens.access),
          },
        }
      );
      let data = await response.json();
      console.log(data);

      if (response.status === 200) {
        setCourseDetails(data);
        setDelayCourseDetails(true);
      } else {
        await timeout(1000);
        setDelayCourseDetails(true);
      }
    }
  };

  let modifyCourseHandler = async (e) => {
    e.preventDefault();
    let req = "coursecreate";
    let reqMethod = "POST";
    let status = "closed";
    if (e.target.open.checked) {
      status = "open";
    }
    console.log(status);
    if (userCtx.courseId !== null) {
      req = "courseedit/" + userCtx.courseId;
      reqMethod = "PUT";
    }
    let response = await fetch("http://localhost:8000/main_app/" + req, {
      method: reqMethod,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(userCtx.authTokens.access),
      },
      body: JSON.stringify({
        name: e.target.name.value,
        description: e.target.description.value,
        status: status,
      }),
    });
    let data = await response.json();
    console.log(data);
    if (response.status === 201 && !userCtx.courseId) {
      userCtx.setCourseId(data.id);
      history("/course");
    } else if (response.status === 200 && userCtx.courseId) {
      history("/");
    } else {
      alert("Something went wrong!");
    }
  };

  let getEnrollmentRequests = async () => {
    if (userCtx.courseId) {
      let response = await fetch(
        "http://localhost:8000/main_app/enrollmentrequestlist/" +
          userCtx.courseId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(userCtx.authTokens.access),
          },
        }
      );
      let data = await response.json();
      console.log(data);

      if (response.status === 200) {
        setEnrollmentRequests(data);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let getEnrolledStudents = async () => {
    let response = await fetch(
      "http://localhost:8000/main_app/enrolledstudentlist/" + userCtx.courseId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        },
      }
    );
    let data = await response.json();
    if (response.status === 200) {
      setEnrolledStudents(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let requestHandler = async (requestId, requestType) => {
    let response = await fetch(
      "http://localhost:8000/main_app/enrollmentrequestaction/" + requestId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        },
        body: JSON.stringify({
          action: requestType,
        }),
      }
    );
    let data = await response.json();

    if (response.status === 200) {
      setEnrollmentRequests((prevState) => {
        let updatedRequests = prevState.filter((request) => {
          return request.id !== requestId;
        });
        return updatedRequests;
      });
      setUpdateEnrolledStudents((prevState) => !prevState);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let addStudentByEmail = async (studentEmail) => {
    let response = await fetch(
      "http://localhost:8000/main_app/enrollmentcreate/" + userCtx.courseId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        },
        body: JSON.stringify({
          student_email: studentEmail,
        }),
      }
    );
    let data = await response.json();
    if (response.status === 201) {
      setUpdateEnrolledStudents((prevState) => !prevState);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let removeStudentHandler = async (id) => {
    let response = await fetch(
      "http://localhost:8000/main_app/enrollmentdelete/" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        },
      }
    );
    if (response.status === 204) {
      setUpdateEnrolledStudents((prevState) => !prevState);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let deleteCourseHandler = async () => {
    let response = await fetch(
      "http://localhost:8000/main_app/coursedelete/" + userCtx.courseId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        },
      }
    );
    if (response.status === 204) {
      history("/");
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <section>
      {(delayCourseDetails || userCtx.courseId === null) && (
        <ModifyCourseDetails
          onSave={modifyCourseHandler}
          courseDetails={courseDetails}
        />
      )}
      <StudentAdmission
        enrollmentRequests={enrollmentRequests}
        enrolledStudents={enrolledStudents}
        onJoinRequest={requestHandler}
        onAddStudent={addStudentByEmail}
        onRemoveStudent={removeStudentHandler}
      />
      <div>
        <Link to={userCtx.courseId ? "/course" : "/"}>
          <button type="button">Back</button>
        </Link>
      </div>
      <div>
        <button onClick={deleteCourseHandler}>Delete Course</button>
      </div>
    </section>
  );
}

export default ModifyCoursePage;
