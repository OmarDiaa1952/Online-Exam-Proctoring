import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import ModifyCourseDetails from "../components/ModifyCourseDetails";
import StudentAdmission from "../components/StudentAdmission";
import UserContext from "../store/user-context";
import { get, dlt, post, put } from "../utils/Fetch";

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
      let response = await get(
        "http://localhost:8000/main_app/coursedetail/" + userCtx.courseId,
        userCtx.authTokens.access
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
    let response = reqMethod === "POST"
      ? await post(
          "http://localhost:8000/main_app/" + req,
          {
            name: e.target.name.value,
            description: e.target.description.value,
            status: status,
          },
          userCtx.authTokens.access
        )
      : await put(
          "http://localhost:8000/main_app/" + req,
          {
            name: e.target.name.value,
            description: e.target.description.value,
            status: status,
          },
          userCtx.authTokens.access
        );
    let data = await response.json();
    console.log(data);
    if (response.status === 201 && !userCtx.courseId) {
      userCtx.setCourseId(data.id);
      swal({
        title: "Course " + userCtx.courseId ? "Modified!" : "Created!",
        text: "Changes has been saved successfully.",
        icon: "success",
        button: "OK",
      })
      history("/course");
    } else if (response.status === 200 && userCtx.courseId) {
      history("/");
    } else {
      alert("Something went wrong!");
    }
  };

  let getEnrollmentRequests = async () => {
    if (userCtx.courseId) {
      let response = await get(
        "http://localhost:8000/main_app/enrollmentrequestlist/" +
          userCtx.courseId,
        userCtx.authTokens.access
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
    let response = await get(
      "http://localhost:8000/main_app/enrolledstudentlist/" + userCtx.courseId,
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setEnrolledStudents(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let requestHandler = async (requestId, requestType) => {
    let response = await put(
      "http://localhost:8000/main_app/enrollmentrequestaction/" + requestId,
      {
        action: requestType,
      },
      userCtx.authTokens.access
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
      let msg = requestType === "accept" ? "accepted" : "rejected";
      swal({
        title: "Request accepted!",
        text: "Student request has been " + msg + " successfully.",
        icon: "success",
        button: "OK",
      });
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let addStudentByEmail = async (studentEmail) => {
    let response = await post(
      "http://localhost:8000/main_app/enrollmentcreate/" + userCtx.courseId,
      {
        student_email: studentEmail,
      },
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 201) {
      setUpdateEnrolledStudents((prevState) => !prevState);
      swal({
        title: "Student Added!",
        text: "Student has been added successfully.",
        icon: "success",
        button: "OK",
      });
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let removeStudentHandler = async (id) => {
    let response = await dlt(
      "http://localhost:8000/main_app/enrollmentdelete/" + id,
      userCtx.authTokens.access
    );
    if (response.status === 204) {
      setUpdateEnrolledStudents((prevState) => !prevState);
      swal({
        title: "Student Removed!",
        text: "Student has been removed successfully.",
        icon: "success",
        button: "OK",
      });
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let deleteCourse = () => {
    swal({
      title: "Are you sure you want to delete?",
      text: "Once deleted, you will not be able to recover it",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteCourseHandler();
        swal("Poof! The course has been deleted!", {
          icon: "success",
        });
      } else {
        swal("The course is safe!");
      }
    });
  };

  let deleteCourseHandler = async () => {
    let response = await dlt(
      "http://localhost:8000/main_app/coursedelete/" + userCtx.courseId,
      userCtx.authTokens.access
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
        <button onClick={deleteCourse} className="btn btn-danger">Delete Course</button>
      </div>
    </section>
  );
}

export default ModifyCoursePage;
