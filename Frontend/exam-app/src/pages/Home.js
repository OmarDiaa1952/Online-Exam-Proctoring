import { useEffect, useState, useContext } from "react";

import HomeNavigation from "../components/HomeNavigation";
import UserContext from "../store/user-context";

function HomePage() {
  let [courses, setCourses] = useState([]);
  let { authTokens, logoutUser } = useContext(UserContext);
  const userCtx = useContext(UserContext);

  useEffect(() => {
    getCourses();
  }, []);

  let getCourses = async () => {
    let response = await fetch(
      "http://localhost:8000/main_app/"+ userCtx.type +"courselist",
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

  const DUMMY_DATA = [
    {
      courseId: "c1",
      courseName: "Course 1",
    },
    {
      courseId: "c2",
      courseName: "Course 2",
    },
    {
      courseId: "c3",
      courseName: "Course 3",
    },
  ];

  return (
    <div>
      <HomeNavigation coursesData={courses} />
    </div>
  );
}

export default HomePage;
