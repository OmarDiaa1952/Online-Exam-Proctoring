import { useEffect, useState } from "react";

const FaceRecognition = (props) => {
  const [faceRecognitionFlag, setFaceRecognitionFlag] = useState(false);

  useEffect(() => {
    setFaceRecognitionFlag(props.faceRecognitionFlag);
  }, [props.faceRecognitionFlag]);

  return (
    <div>
      {!faceRecognitionFlag && (
        <p className="card fixed-top">
          Warning, Please 
        </p>
      )}
    </div>
  );
};

export default FaceRecognition;
