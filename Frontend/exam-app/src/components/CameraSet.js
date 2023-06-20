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
          videoConstraints={{ deviceId: multipleCameras ? devices[deviceIndex].deviceId : devices[0].deviceId }}
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
      <div className="card">
        <h3 className="card-header">WebCam Test!</h3> 
        <div className="card-body">
          <div>
            <h4 className="card-title">
              Your image should appear in this camera, if not Please click on
              <b> Switch!</b>
            </h4>  
            <div>{webcam}</div>
          </div>
          <div>
            <button onClick={switchCamera} className="btn btn-primary m-2">
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
