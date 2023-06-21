import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;

const WebcamCapture = (props) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    props.setImg(imageSrc);
  }, [webcamRef, setImgSrc]);

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
    deviceId: { exact: props.facingMode },
    width: 200,
    height: 200
  };

  useEffect(() => {
    proctoring();
    console.log(imgSrc);
  }, []);

  useEffect(() => {
    console.log(props.facingMode);
  }, [props.facingMode]);

  let proctoring = async () => {
    await timeout(5000);
    capture();
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
    </>
  );
};

export default WebcamCapture;