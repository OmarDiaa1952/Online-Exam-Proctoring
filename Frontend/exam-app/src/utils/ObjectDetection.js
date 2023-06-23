import { useEffect, useState } from "react";

const ObjectDetection = (props) => {
  const [objectDetectionFlag, setObjectDetectionFlag] = useState(false);

  useEffect(() => {
    setObjectDetectionFlag(props.objectDetectionFlag);
  }, [props.objectDetectionFlag]);

  return (
    <div>
      {objectDetectionFlag !== "none" && (
        <p className="card fixed-top">
          Warning, You are not allowed to use {objectDetectionFlag} during the exam!
        </p>
      )}
    </div>
  );
};

export default ObjectDetection;
