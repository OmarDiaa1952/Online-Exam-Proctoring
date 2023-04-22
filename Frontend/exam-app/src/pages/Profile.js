import { useState, useContext, useEffect } from "react";

import UserInfo from "../components/UserInfo";
import UserContext from "../store/user-context";

function ProfilePage() {
  const userCtx = useContext(UserContext);

  const [userData, setUserData] = useState({
    username: "",
    name: "",
    email: "",
    photo: "",
  });

  useEffect(() => {
    getUserData();
  }, []);

  let getUserData = async () => {
    let response = await fetch("http://localhost:8000/users/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(userCtx.authTokens.access),
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setUserData(data);
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <UserInfo userData={userData} />
    </div>
  );
}

export default ProfilePage;
