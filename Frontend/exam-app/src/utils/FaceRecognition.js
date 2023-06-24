import { useEffect, useState } from "react";

const FaceRecognition = (props) => {
  const [faceRecognitionFlag, setFaceRecognitionFlag] = useState(1);

  useEffect(() => {
    setFaceRecognitionFlag(props.faceRecognitionFlag);
  }, [props.faceRecognitionFlag]);

  return (
    <div>
    </div>
  );
};

export default FaceRecognition;
