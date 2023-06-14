import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";

import ModifyCourseDetails from "../components/ModifyCourseDetails";
import UserContext from "../store/user-context";
import { get, dlt, post, put } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts"; 

function ModifyCoursePage() {
  const history = useNavigate();
  const userCtx = useContext(UserContext);
  let [courseDetails, setCourseDetails] = useState([]);
  let [delayCourseDetails, setDelayCourseDetails] = useState(false);

  useEffect(() => {
    getCourseDetails();
  }, []);

  useEffect(() => {
    console.log(courseDetails);
  }, [delayCourseDetails]);

  let getCourseDetails = async () => {
    if (userCtx.courseId) {
      let response = await get(
        BASEURL + "/main_app/coursedetail/" + userCtx.courseId,
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
    let response =
      reqMethod === "POST"
        ? await post(
            BASEURL + "/main_app/" + req,
            {
              name: e.target.name.value,
              description: e.target.description.value,
              status: status,
            },
            userCtx.authTokens.access
          )
        : await put(
            BASEURL + "/main_app/" + req,
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
      });
      history("/course");
    } else if (response.status === 200 && userCtx.courseId) {
      history("/");
    } else {
      alert("Something went wrong!");
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
      BASEURL + "/main_app/coursedelete/" + userCtx.courseId,
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

      <div>
        <Link to={userCtx.courseId ? "/course" : "/"}>
          <button type="button">Back</button>
        </Link>
      </div>
      {userCtx.courseId !== null && (
        <div>
          <button onClick={deleteCourse} className="btn btn-danger">
            Delete Course
          </button>
        </div>
      )}
    </section>
  );
}

export default ModifyCoursePage;
