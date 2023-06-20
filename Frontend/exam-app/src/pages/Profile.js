import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import UserInfo from "../components/UserInfo";
import UserContext from "../store/user-context";
import { get, put } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userCtx.type === "student") checkPhoto();
    if (imageDataURL) {
      setPhoto();
      setImageDataURL(null);
    }
    getUserData();
  }, [hasPhoto]);

  let checkPhoto = async () => {
    setIsLoading(true);
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
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
    setIsLoading(false);
  };

  let setPhoto = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Couldn't upload your photo.",
        icon: "error",
        button: "OK",
      });
    }
  };

  let getUserData = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/users/userdata",
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (response.status === 200) {
      setUserData(data);
      if (hasPhoto) {
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
        } else {
          swal({
            title: "Error",
            text: "Couldn't retrieve your photo.",
            icon: "error",
            button: "OK",
          });
        }
      }
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
    setIsLoading(false);
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          <div className="container-fluid flex-row">
          <div className="container-fluid row">
            <div className="col-2 row d-flex flex-column justify-content-center align-items-center">
              <div className="p-2 align-self-center">
              {hasPhoto && (
                <img src={userData.photo} alt="Please take a photo" width="180px" height="180px" className="border border-success rounded-circle" />
              )}</div>
              <div className="p-2 align-self-center">
                <button
                  type="button"
                  onClick={useCamera}
                  className="btn btn-success btn-lg"
                >
                  {hasPhoto ? "Update Photo" : "Take Photo"}
                </button>
              </div>
            </div>
            <div className="col-1"></div>
            <div className="col-8"><UserInfo userData={userData} /></div>
            
          </div>
        </div></div>
      )}
    </div>
  );
}

export default ProfilePage;
