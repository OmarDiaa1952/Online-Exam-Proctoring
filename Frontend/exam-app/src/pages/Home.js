import { useEffect, useState, useContext } from "react";

import HomeNavigation from "../components/HomeNavigation";
import UserContext from "../store/user-context";

function HomePage() {
  let [courses, setCourses] = useState([]);
  let [searchedCourses, setSearchedCourses] = useState([]);
  let { authTokens, logoutUser } = useContext(UserContext);
  const userCtx = useContext(UserContext);
  userCtx.setCourseId(null);
  userCtx.setExamId(null);

  useEffect(() => {
    getCourses();
  }, []);

  let getCourses = async () => {
    let response = await fetch(
      "http://localhost:8000/main_app/" + userCtx.type + "courselist",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();

    if (response.status === 200) {
      setCourses(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  let changeSearchTextHandler = async (text) => {
    let response = await fetch("http://localhost:8000/coursesearch/" + text, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setSearchedCourses(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <div>
      <HomeNavigation
        coursesData={courses}
        onChangeSearchText={changeSearchTextHandler}
        searchResult={searchedCourses}
      />
    </div>
  );
}

export default HomePage;
