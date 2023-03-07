import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
      : "student"
  );
  const [courseId, setCourseId] = useState(() =>
    localStorage.getItem("courseId") ? localStorage.getItem("courseId") : null
  );
  const [examId, setExamId] = useState(() =>
    localStorage.getItem("examId") ? localStorage.getItem("examId") : null
  );

  function setUserTypeHandler(type) {
    setUserType(type);
  }

  function setCourseIdHandler(id) {
    setCourseId(id);
    localStorage.setItem("courseId", id);
  }

  function setExamIdHandler(id) {
    setExamId(id);
    localStorage.setItem("examId", id);
  }

  const history = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch("http://localhost:8000/users/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      setCourseId(null);
      setExamId(null);
      localStorage.setItem("authTokens", JSON.stringify(data));
      localStorage.setItem("userType", userType);
      localStorage.setItem("courseId", null);
      localStorage.setItem("examId", null);
      history("/");
    } else {
      alert("Something went wrong!");
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
    let response = await fetch(
      "http://localhost:8000/users/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      }
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
    loginUser: loginUser,
    logoutUser: logoutUser,
    setUserType: setUserTypeHandler,
    setAuthTokens: setAuthTokens,
    setCourseId: setCourseIdHandler,
    setExamId: setExamIdHandler,
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
