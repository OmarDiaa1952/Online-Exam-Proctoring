import { useState } from "react";

import classes from "./WebcamContainer.module.css";
import WebcamCapture from "../utils/WebcamCapture";

function WebcamContainer(props) {
  const [img1view, setImg1View] = useState(true);
  const [img2view, setImg2View] = useState(true);
  return (
    <div className="container">
      <div className="row align-content-end flex-column">
        <div className="col-md-4">
          <div className={img1view ? "visible" : "invisible"}>
            <WebcamCapture
              setImg={props.setImg}
              facingMode={props.facingMode1}
            />
          </div>
          <button onClick={() => setImg1View(!img1view)}>
            {img1view ? "Hide my face" : "Show my face"}
          </button>
        </div>
        <div className="col-md-4">
          <div className={img2view ? "visible" : "invisible"}>
            <WebcamCapture
              setImg={props.setImg2}
              facingMode={props.facingMode2}
            />
          </div>
          <button onClick={() => setImg2View(!img2view)}>
            {img2view ? "Hide environment" : "Show Environment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebcamContainer;
