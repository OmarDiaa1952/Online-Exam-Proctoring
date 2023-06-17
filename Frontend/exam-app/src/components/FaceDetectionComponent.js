import { useContext, useEffect, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

import classes from "./FaceDetectionComponent.module.css";
import { post, get } from "../utils/Fetch";
import UserContext from "../store/user-context";
import VideoTimer from "../utils/VideoTimer";

const WebcamComponent = () => <Webcam />;

const FaceDetectionComponent = (props) => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [finishedRecording, setFinishedRecording] = useState(false);

  useEffect(() => {
    if (finishedRecording) {
      handleSave();
    }
  }, [finishedRecording]);

  // useEffect(() => {
  //         handleStartCapture();
  // }, []);

  let videoUpload = async (text) => {
    const data = {
      video: text,
    };
    console.log(data);
    props.setVideo(data);
  };

  const handleStartCapture = useCallback(() => {
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

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCapture = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    setFinishedRecording(true);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleSave = useCallback(() => {
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
      <div>
        <VideoTimer
          text="The Exam will start in"
          stopRecording={handleStopCapture}
          startRecording={capturing}
        />
        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={{ deviceId: userCtx.camera1 }}
        />
      </div>
      {!capturing && (
        <button onClick={handleStartCapture}>{props.startMessage}</button>
      )}
    </>
  );
};

export default FaceDetectionComponent;
