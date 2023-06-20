import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CameraSet from "../components/CameraSet";
import FaceDetectionComponent from "../components/FaceDetectionComponent";
import UserContext from "../store/user-context";
import { post } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

const FaceDetectionPage = () => {
  const [cameraSetFlag, setCameraSetFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  let faceDetectionHandler = () => {
    setCameraSetFlag(true);
  };

  let sendVideo = async (text) => {
    setIsLoading(true);
    let response = await post(
      BASEURL + "/main_app/livenessvideoupload/" + userCtx.examId,
      text,
      userCtx.authTokens.access
    );
    let data = await response.json();
    if (data.recognized === "true") {
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
      navigate("/exam-details");
    }
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <NavBar />
          {cameraSetFlag ? (
            <FaceDetectionComponent
              setVideo={sendVideo}
              startMessage={"Start Exam"}
              messageDisplayed={"The Exam will start in:"}
            />
          ) : (
            <CameraSet onProceed={faceDetectionHandler} />
          )}
        </div>
      )}
    </div>
  );
};

export default FaceDetectionPage;
