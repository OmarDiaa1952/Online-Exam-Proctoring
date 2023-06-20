import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import StudentAdmission from "../components/StudentAdmission";
import UserContext from "../store/user-context";
import { get, dlt, post, put } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

function CourseStudentsPage() {
  let [enrollmentRequests, setEnrollmentRequests] = useState([]);
  let [enrolledStudents, setEnrolledStudents] = useState([]);
  let [updateEnrolledStudents, setUpdateEnrolledStudents] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let userCtx = useContext(UserContext);

  useEffect(() => {
    getEnrollmentRequests();
  }, []);
  useEffect(() => {
    getEnrolledStudents();
  }, [updateEnrolledStudents]);

  let getEnrollmentRequests = async () => {
    setIsLoading(true);
    if (userCtx.courseId) {
      let response = await get(
        BASEURL + "/main_app/enrollmentrequestlist/" + userCtx.courseId,
        userCtx.authTokens.access
      );
      let data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setEnrollmentRequests(data);
        setIsLoading(false);
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    }
  };

  let getEnrolledStudents = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/main_app/enrolledstudentlist/" + userCtx.courseId,
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setEnrolledStudents(data);
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  let requestHandler = async (requestId, requestType) => {
    setIsLoading(true);
    let response = await put(
      BASEURL + "/main_app/enrollmentrequestaction/" + requestId,
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
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  let addStudentByEmail = async (studentEmail) => {
    setIsLoading(true);
    let response = await post(
      BASEURL + "/main_app/enrollmentcreate/" + userCtx.courseId,
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
      setIsLoading(false);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let removeStudentHandler = async (id) => {
    setIsLoading(true);
    let response = await dlt(
      BASEURL + "/main_app/enrollmentdelete/" + id,
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
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };
  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div>
            <StudentAdmission
              enrollmentRequests={enrollmentRequests}
              enrolledStudents={enrolledStudents}
              onJoinRequest={requestHandler}
              onAddStudent={addStudentByEmail}
              onRemoveStudent={removeStudentHandler}
            />
            <div>
              <Link to="/course">
                <button type="button">Back to Course</button>
              </Link>
            </div>
            <div>
              <Link to="/">
                <button type="button">Home</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseStudentsPage;
