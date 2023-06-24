import { useEffect, useState } from "react";

const ObjectDetection = (props) => {
  const [objectDetectionFlag, setObjectDetectionFlag] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    setObjectDetectionFlag(props.objectDetectionFlag);
  }, [props.objectDetectionFlag]);

  useEffect(() => {
    if (remainingSeconds > 0) 
      delay(1).then(() => {
      setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
    });
  }, [remainingSeconds]);

  useEffect(() => {
    if(objectDetectionFlag === "cell phone" || objectDetectionFlag === "book") setRemainingSeconds(5);
  }, [objectDetectionFlag]);

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  let delay = async (seconds) => {
    await timeout(1000 * seconds);
  };

  return (
    <div>
      {remainingSeconds > 0 && (
        <p className="card fixed-top">
          Warning, You are not allowed to use {objectDetectionFlag} during the exam!
        </p>
      )}
    </div>
  );
};

export default ObjectDetection;
