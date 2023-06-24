import { useEffect, useState } from "react";

const ObjectDetection = (props) => {
  const [objectDetectionFlag, setObjectDetectionFlag] = useState("none");

  useEffect(() => {
    setObjectDetectionFlag(props.objectDetectionFlag);
  }, [props.objectDetectionFlag]);

  return (
    <div>
    </div>
  );
};

export default ObjectDetection;
