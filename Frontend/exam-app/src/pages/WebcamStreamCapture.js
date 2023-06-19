import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import swal from "sweetalert";

import { post, get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import UserContext from "../store/user-context";
import CameraSet from "../components/CameraSet";
import FaceDetectionComponent from "../components/FaceDetectionComponent";
import LoadingSpinner from "../components/LoadingSpinner";

const WebcamComponent = () => <Webcam />;

const WebcamStreamCapturePage = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [cameraSetFlag, setCameraSetFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let faceDetectionHandler = () => {
    setCameraSetFlag(true);
  };

  let checkVideo = async () => {
    setIsLoading(true);
    let response = await get(
      BASEURL + "/users/videoexists",
      userCtx.authTokens.access
    );
    if (response.status === 200) {
      navigate("/");
      setIsLoading(false);
    } else if (response.status === 404) {
      setIsLoading(false);
    } else {
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  useEffect(() => {
    checkVideo();
  }, []);

  let videoUpload = async (text) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div>
            {cameraSetFlag ? (
              <FaceDetectionComponent
                setVideo={videoUpload}
                startMessage={"Start Recording"}
                messageDisplayed={"Remaining Time: "}
              />
            ) : (
              <CameraSet onProceed={faceDetectionHandler} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WebcamStreamCapturePage;
