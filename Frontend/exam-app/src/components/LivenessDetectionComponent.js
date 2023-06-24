import { useContext, useEffect, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

import classes from "./LivenessDetectionComponent.module.css";
import { post, get } from "../utils/Fetch";
import UserContext from "../store/user-context";
import VideoTimer from "../utils/VideoTimer";

const WebcamComponent = () => <Webcam />;

const LivenessDetectionComponent = (props) => {
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
      <div className="card">
        <h3 className="card-header">{props.title}</h3>
        <div className="card-body d-flex flex-column justify-contents-center align-items-center align-self-center">
          <div>
            <h4 className="card-title">
              <VideoTimer
                text={props.messageDisplayed}
                stopRecording={handleStopCapture}
                startRecording={capturing}
              />
            </h4>
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{ deviceId: userCtx.camera1 }}
              width={400}
              height={400}
            />
          </div>
          {!capturing && (
            <button onClick={handleStartCapture} className="btn btn-success">{props.startMessage}</button>
          )}
        </div>
      </div>
    </>
  );
};

export default LivenessDetectionComponent;
