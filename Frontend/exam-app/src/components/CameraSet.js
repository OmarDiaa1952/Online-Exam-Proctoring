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
    if(!devices[0]) return;
    setWebcam(
      <div>
        <Webcam
          audio={false}
          videoConstraints={{ deviceId: devices[deviceIndex].deviceId }}
        />
      </div>
    );
    userCtx.setCamera1(devices[deviceIndex].deviceId);
    userCtx.setCamera2(devices[(deviceIndex + 1) % devices.length].deviceId);
  }, [deviceIndex, devices])

  let switchCamera = () => {
    setDeviceIndex((prev) => (prev + 1) % devices.length);
  };

  return (
    <div className="Camera">
      <div>
        <p>
          Your image should appear in this camera, if not Please click on
          Switch!
        </p>
        <div>{webcam}</div>
      </div>
      <div>
        <button onClick={switchCamera}>Switch</button>
        <button onClick={props.onProceed}>Proceed</button>
      </div>
    </div>
  );
};

export default CameraSet;
