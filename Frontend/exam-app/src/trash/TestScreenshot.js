import { useScreenshot } from "./TakeScreenShot";
import { useRef, createRef } from "react";

const TestScreenShot = () => {
  const imageRef = useRef(null);
  const ref = createRef(null); 

  const { image, takeScreenshot} = useScreenshot({
    ref: imageRef,
  });
  const imgStyle = { height: 400, width: 400 };
  const getImage = () => takeScreenshot({ ref });
  const downloadImage = () => {
    var FileSaver = require("file-saver");
    FileSaver.saveAs(`${image}`, "image.jpg");
  };
  return (
    <div>
      <button onClick={getImage}>Take screenshot</button>

      <button onClick={downloadImage}>Download</button>
      <div ref={ref}>
        <img
          id="scream"
          style={imgStyle}
        //   src={url}
          height="448"
          width="100%"
          ref={imageRef}
          alt={"ScreenShot"}
        ></img>{" "}
      </div>
    </div>
  );
};

export default TestScreenShot;
