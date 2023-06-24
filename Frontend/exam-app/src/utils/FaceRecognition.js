import { useEffect, useState } from "react";

const FaceRecognition = (props) => {
  const [faceRecognitionFlag, setFaceRecognitionFlag] = useState(1);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    setFaceRecognitionFlag(props.faceRecognitionFlag);
  }, [props.faceRecognitionFlag]);

  useEffect(() => {
    if (remainingSeconds > 0)
      delay(1).then(() => {
        setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
      });
  }, [remainingSeconds]);

  useEffect(() => {
    if (faceRecognitionFlag > 1 || faceRecognitionFlag === 0)
      setRemainingSeconds(5);
  }, [faceRecognitionFlag, props.refresh]);

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  let delay = async (seconds) => {
    await timeout(1000 * seconds);
  };

  return (
    <div>
      {remainingSeconds > 0 &&
        (faceRecognitionFlag === 0 ? (
          <p className="card fixed-top">
            Warning, Please keep your face in the camera frame during the exam!
          </p>
        ) : (
          <p className="card fixed-top">
            Warning, We have noticed more than one face in the camera frame
            during the exam, Please make sure you are alone in the room!
          </p>
        ))}
    </div>
  );
};

export default FaceRecognition;
