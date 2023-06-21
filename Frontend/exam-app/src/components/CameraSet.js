import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";

import classes from "./CameraSet.module.css";
import UserContext from "../store/user-context";

const WebcamComponent = () => <Webcam />;

const CameraSet = (props) => {
  const [devices, setDevices] = useState([]);
  const [deviceIndex, setDeviceIndex] = useState(1);
  const [webcam, setWebcam] = useState(null);
  const userCtx = useContext(UserContext);

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  useEffect(() => {
    if (!devices[0]) return;
    let multipleCameras = devices.length > 1;
    setWebcam(
      <div>
        <Webcam
          audio={false}
          height={400}
          width={400}
          videoConstraints={{ deviceId: multipleCameras ? devices[deviceIndex].deviceId : devices[0].deviceId}}
        />
      </div>
    );
    userCtx.setCamera1(multipleCameras ? devices[deviceIndex].deviceId : devices[0].deviceId);
    userCtx.setCamera2(multipleCameras ? devices[(deviceIndex + 1) % devices.length].deviceId : null);
  }, [deviceIndex, devices])

  let switchCamera = () => {
    setDeviceIndex((prev) => (prev + 1) % devices.length);
  };

  return (
    <div className="Camera">
      <div className="card d-flex flex-column justify-contents-center align-items-center align-self-center">
        <div className="card-body d-flex flex-column justify-contents-center align-items-center align-self-center">
          <div>
            <h4 className="card-title">
              Your image should appear in this camera, if not Please click on
              <b> Switch!</b>
            </h4>  
            <div className="d-flex flex-column justify-contents-center align-items-center align-self-center">{webcam}</div>
          </div>
          <div>
            <button onClick={switchCamera} className="btn btn-secondary m-2">
              Switch
            </button>
            <button onClick={props.onProceed} className="btn btn-success m-2">
              Proceed
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CameraSet;
