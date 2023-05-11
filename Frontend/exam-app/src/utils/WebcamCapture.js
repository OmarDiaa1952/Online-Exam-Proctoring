import React, { useEffect } from "react";
import Webcam from "react-webcam";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const WebcamComponent = () => <Webcam />;

const WebcamCapture = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);

  const capture = React.useCallback(() => {
    console.log();
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    props.setImg(imageSrc);
  }, [webcamRef, setImgSrc]);

  const handleSwitch = React.useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = webcamRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  let videoConstraints = {
    deviceId: props.deviceId,
    facingMode: { exact: "right" },
    width: 200,
    height: 200
  };

  useEffect(() => {
    proctoring();
    console.log(imgSrc);
  }, []);

  useEffect(() => {
    console.log(facingMode);
  }, [facingMode]);

  let proctoring = async () => {
    capture();
    await timeout(5000);
    proctoring();
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <>
      <Webcam
        muted={false}
        height={200}
        ref={webcamRef}
        width={200}
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
      />
      <button onClick={handleSwitch}>Switch</button>
    </>
  );
};

export default WebcamCapture;