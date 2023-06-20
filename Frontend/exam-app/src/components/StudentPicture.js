import classes from "./StudentPicture.module.css";

import { useState, useCallback, useRef, useContext } from "react";
import Webcam from "react-webcam";

import UserContext from "../store/user-context";

const WebcamComponent = () => <Webcam />;

const StudentPicture = (props) => {
  const [picture, setPicture] = useState("");
  const userCtx = useContext(UserContext);
  const videoConstraints = {
    width: 400,
    height: 400,
    deviceId: userCtx.camera1,
  };
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
  });
  return (
    <div>
      <h2 className="mb-5 text-center">Set Profile Picture</h2>
      <div>
        {picture == "" ? (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={picture} />
        )}
      </div>
      <div>
        {picture != "" ? (
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setPicture("");
              }}
              className="btn btn-secondary"
            >
              Retake
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                props.updatePhoto(picture);
              }}
              className="btn btn-success"
            >
              Save Photo
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
              className="btn btn-success"
            >
              Capture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentPicture;
