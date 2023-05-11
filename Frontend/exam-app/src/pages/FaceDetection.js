import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CameraSet from "../components/CameraSet";
import FaceDetectionComponent from "../components/FaceDetectionComponent";
import UserContext from "../store/user-context";
import { post } from "../utils/Fetch";

const FaceDetectionPage = () => {
  const [cameraSetFlag, setCameraSetFlag] = useState(false);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  let faceDetectionHandler = () => {
    setCameraSetFlag(true);
  };

  let sendVideo = async (text) => {
    let response = await post(
      "http://localhost:8000/main_app/recognitionvideoupload/" + userCtx.examId,
      text,
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (data.recognized) {
      swal({
        title: "Success!",
        text: "Exam Started!",
        icon: "success",
        button: "Ok!",
      });
      navigate("/exam");
    } else {
      swal({
        title: "Failed!",
        text: "Failed to identify your face!",
        icon: "warning",
        button: "Ok!",
      });
    }
  };

  return (
    <div>
      {cameraSetFlag ? (
        <FaceDetectionComponent setVideo={sendVideo} />
      ) : (
        <CameraSet onProceed={faceDetectionHandler} />
      )}
    </div>
  );
};

export default FaceDetectionPage;
