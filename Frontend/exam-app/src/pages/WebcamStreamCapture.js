import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import swal from "sweetalert";

import { post, get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts"; 
import UserContext from "../store/user-context";
import CameraSet from "../components/CameraSet";
import FaceDetectionComponent from "../components/FaceDetectionComponent";

const WebcamComponent = () => <Webcam />;

const WebcamStreamCapturePage = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [cameraSetFlag, setCameraSetFlag] = useState(false);

  let faceDetectionHandler = () => {
    setCameraSetFlag(true);
  };

  let checkVideo = async () => {
    let response = await get(
      BASEURL + "/users/videoexists",
      userCtx.authTokens.access
    );
    if (response.status === 200) {
      navigate("/");
    } else if (response.statusText === "Unauthorized") {
      userCtx.logoutUser();
    }
  };

  useEffect(() => {
    checkVideo();
  }, []);

  let videoUpload = async (text) => {
    let response = await post(
      BASEURL + "/users/registrationvideoupload",
      text,
      userCtx.authTokens.access
    );
    swal({
      title: "Success!",
      text: "Video Uploaded!",
      icon: "success",
      button: "Ok!",
      });
    navigate("/");
  };

  return (
    <>
      <div>
      {cameraSetFlag ? (
        <FaceDetectionComponent setVideo={videoUpload} startMessage={"Start Recording"} />
      ) : (
        <CameraSet onProceed={faceDetectionHandler} />
      )}
    </div>
    </>
  );
};

export default WebcamStreamCapturePage;
