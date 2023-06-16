import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import UserInfo from "../components/UserInfo";
import UserContext from "../store/user-context";
import { get, put } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts"; 

function ProfilePage() {
  const userCtx = useContext(UserContext);
  const location = useLocation();
  let image = location.state ? location.state : null;
  const [imageDataURL, setImageDataURL] = useState(image);
  const [hasPhoto, setHasPhoto] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    name: "",
    email: "",
    photo: "",
  });

  useEffect(() => {
    if(userCtx.type === "student") checkPhoto();
    if (imageDataURL) {
      setPhoto();
      setImageDataURL(null);
    }
    getUserData();
  }, []);

  let checkPhoto = async () => {
    let response = await get(
      BASEURL + "/users/photoexists",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      if (data.has_photo) {
        setHasPhoto(true);
      } else {
        setHasPhoto(false);
      }
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  let setPhoto = async () => {
    let response = await put(
      BASEURL + "/users/photoupload",
      { photo: imageDataURL },
      userCtx.authTokens.access
    );
    if (response.status === 200) {
      setUserData((prev) => ({
        ...prev,
        photo: imageDataURL.photo,
      }));
    } else if (response.statusText === "Unauthorized") {
      swal({
        title: "Error",
        text: "Couldn't upload your photo.",
        icon: "error",
        button: "OK",
      });
    }
  };

  let getUserData = async () => {
    let response = await get(
      BASEURL + "/users/userdata",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setUserData(data);
      if (userCtx.type === "student") {
        let response = await get(
          BASEURL + "/users/photoretrieve",
          userCtx.authTokens.access
        );
        let data = await response.json();
        if (response.status === 200) {
          setUserData((prev) => ({
            ...prev,
            photo: data.photo,
          }));
        } else if (response.statusText === "Unauthorized") {
          swal({
            title: "Error",
            text: "Couldn't retrieve your photo.",
            icon: "error",
            button: "OK",
          });
        }
      }
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  const history = useNavigate();
  const useCamera = () => {
    navigator.getUserMedia(
      { audio: true, video: true },
      function (stream) {
        stream.getTracks().forEach((x) => x.stop());
        history("/profile-pic");
      },
      (err) => console.log(err)
    );
  };

  return (
    <div>
      <h1>Profile</h1>
      {userCtx.type === "student" && (
        <div>
          <img src={userData.photo} alt="Please take a photo" />
          {/* {!loading && ( */}
          <div>
            <button type="button" onClick={useCamera}>
              {hasPhoto ? "Update Photo" : "Take Photo"}
            </button>
          </div>
        </div>
      )}
      <UserInfo userData={userData} />
      {/* )} */}
      <div>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;
