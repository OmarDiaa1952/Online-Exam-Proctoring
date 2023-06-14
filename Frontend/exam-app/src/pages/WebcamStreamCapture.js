import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

import { post, get } from "../utils/Fetch";
import { BASEURL } from "../utils/Consts"; 
import UserContext from "../store/user-context";
import VideoTimer from "../utils/VideoTimer";

const WebcamComponent = () => <Webcam />;

const WebcamStreamCapturePage = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [isSaved, setIsSaved] = React.useState(false);

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

  React.useEffect(() => {
    checkVideo();
  }, []);

  let videoUpload = async (text) => {
    const data = {
      video: text,
    };
    let response = await post(
      BASEURL + "/users/registrationvideoupload",
      data,
      userCtx.authTokens.access
    );
  };

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCapture = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleSave = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        videoUpload(base64data);
      };
      setIsSaved(true);
    }
  }, [recordedChunks]);

  return (
    <>
      <VideoTimer
        text="Video Remaining Time"
        stopRecording={handleStopCapture}
        startRecording={capturing}
      />
      <Webcam audio={false} ref={webcamRef} />
      {!capturing && (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {!isSaved && recordedChunks.length > 0 && (
        <div>
          <button onClick={handleSave}>Save</button>
        </div>
      )}
      {isSaved && <button onClick={() => navigate(-1)}>Done</button>}
    </>
  );
};

export default WebcamStreamCapturePage;
