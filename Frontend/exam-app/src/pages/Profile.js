import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import UserInfo from "../components/UserInfo";
import UserContext from "../store/user-context";
import { get } from "../utils/Fetch";

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
    let response = await get("http://localhost:8000/users/userdata", userCtx.authTokens.access);
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
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;
