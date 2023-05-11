import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

import { post } from "../utils/Fetch";

const UserContext = createContext();

export default UserContext;

export function UserContextProvider({ children }) {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(() =>
    localStorage.getItem("userType")
      ? localStorage.getItem("userType")
      : null
  );
  const [courseId, setCourseId] = useState(() =>
    localStorage.getItem("courseId") ? localStorage.getItem("courseId") : null
  );
  const [examId, setExamId] = useState(() =>
    localStorage.getItem("examId") ? localStorage.getItem("examId") : null
  );

  const [camera1, setCamera1] = useState(() =>
    localStorage.getItem("camera1") ? localStorage.getItem("camera1") : null
    );

  const [camera2, setCamera2] = useState(() =>
    localStorage.getItem("camera2") ? localStorage.getItem("camera2") : null
    );

  function setUserTypeHandler(type) {
    setUserType(type);
    localStorage.setItem("userType", type);
  }

  function setCourseIdHandler(id) {
    setCourseId(id);
    localStorage.setItem("courseId", id);
  }

  function setExamIdHandler(id) {
    setExamId(id);
    localStorage.setItem("examId", id);
  }

  function setCamera1Handler(id) {
    setCamera1(id);
    localStorage.setItem("camera1", id);
  }

  function setCamera2Handler(id) {
    setCamera2(id);
    localStorage.setItem("camera2", id);
  }

  const history = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    let response = await post("http://localhost:8000/users/api/token/", {
      username: e.target.username.value,
      password: e.target.password.value,
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      setCourseId(null);
      setExamId(null);
      localStorage.setItem("authTokens", JSON.stringify(data));
      localStorage.setItem("userType", data.role.toLowerCase());
      localStorage.setItem("courseId", null);
      localStorage.setItem("examId", null);
      // await timeout(1000);
      history("/");
    } else {
      swal({
        title: "Failed!",
        text: "The username or password is wrong!",
        icon: "warning",
        button: "Ok!",
      });
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("userType");
    localStorage.removeItem("courseId");
    localStorage.removeItem("examId");
    history("/welcome");
  };

  let updateToken = async () => {
    console.log("Updating token");
    let response = await post(
      "http://localhost:8000/users/api/token/refresh/",
      { refresh: authTokens?.refresh }
    );
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }
    if (loading) {
      setLoading(false);
    }
  };

  let context = {
    user: user,
    authTokens: authTokens,
    type: userType,
    courseId: courseId,
    examId: examId,
    camera1: camera1,
    camera2: camera2,
    loginUser: loginUser,
    logoutUser: logoutUser,
    setUserType: setUserTypeHandler,
    setAuthTokens: setAuthTokens,
    setCourseId: setCourseIdHandler,
    setExamId: setExamIdHandler,
    setCamera1: setCamera1Handler,
    setCamera2: setCamera2Handler,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <UserContext.Provider value={context}>
      {loading ? null : children}
    </UserContext.Provider>
  );
}
