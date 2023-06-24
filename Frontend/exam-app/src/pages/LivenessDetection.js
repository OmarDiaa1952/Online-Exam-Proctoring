import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import CameraSet from "../components/CameraSet";
import LivenessDetectionComponent from "../components/LivenessDetectionComponent";
import UserContext from "../store/user-context";
import { post } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts";
import LoadingSpinner from "../components/LoadingSpinner";
import NavBar from "../components/NavBar";

const LivenessDetectionPage = () => {
  const [cameraSetFlag, setCameraSetFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  let livenessDetectionHandler = () => {
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
      navigate("/exam");
    } else {
      navigate("/exam");
      // swal({
      //   title: "Failed!",
      //   text: "Failed to identify your face!",
      //   icon: "warning",
      //   button: "Ok!",
      // });
      // navigate("/exam-details");
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
          <div className="general">
            {cameraSetFlag ? (
              <LivenessDetectionComponent
                setVideo={sendVideo}
                title={"Pre-Exam Video Check"}
                startMessage={"Start Exam"}
                messageDisplayed={"The Exam will start in:"}
              />
            ) : (
              <CameraSet onProceed={livenessDetectionHandler} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LivenessDetectionPage;
