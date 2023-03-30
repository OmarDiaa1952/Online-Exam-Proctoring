import React, { useEffect } from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  useEffect(() => {
    proctoring();
    console.log(imgSrc);
  }, [imgSrc]);

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
        screenshotFormat="image/jpeg"
      />
    </>
  );
};

export default WebcamCapture;