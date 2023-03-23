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

  let crsId = "";
  if (userCtx.courseId) {
    var courseId = userCtx.courseId;
    crsId = "/" + courseId;
  }

  useEffect(() => {
    getCourseDetails();
    getEnrollmentRequests();
  }, []);

  let getCourseDetails = async () => {
    if (userCtx.courseId) {
      let response = await fetch(
        "http://localhost:8000/main_app/coursedetail" + crsId,
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
        setCourseDetails(data);
      } else if (response.statusText === "Unauthorized") {
        userCtx.logoutUser();
      }
    }
  };

  let modifyCourseHandler = async (e) => {
    e.preventDefault();
    let req = "courseedit";
    let reqMethod = "PUT";
    if (!userCtx.courseId) {
      req = "coursecreate";
      reqMethod = "POST";
    }
    let response = await fetch(
      "http://localhost:8000/main_app/" + req + crsId,
      {
        method: reqMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(userCtx.authTokens.access),
        },
        body: JSON.stringify({
          name: e.target.name.value,
          description: e.target.description.value,
        }),
      }
    );
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
    if(userCtx.courseId) {let response = await fetch(
      "http://localhost:8000/main_app/enrollmentrequestlist" + crsId,
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
    }}
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
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let deleteCourseHandler = async () => {
    let response = await fetch(
      "http://localhost:8000/main_app/coursedelete/" + courseId,
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

  return (
    <section>
      <ModifyCourseDetails
        onSave={modifyCourseHandler}
        courseDetails={courseDetails}
      />
      <StudentAdmission
        studentsData={enrollmentRequests}
        onJoinRequest={requestHandler}
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
