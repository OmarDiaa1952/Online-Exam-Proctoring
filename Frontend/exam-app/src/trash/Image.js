import React, { createRef, useState } from "react";
import { useScreenshot } from "./TakeScreenShot";

const Image = (props) => {
  const ref = createRef(null);
  const [image, takeScreenShot] = useScreenshot();
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);

  const getImage = () => {
    takeScreenShot(ref.current);
    props.updatePhoto(ref.current);
  }

  return (
    <div>
      <div>
        <button onClick={getImage}>
          Take screenshot
        </button>
        <label>
          Width:
          <input value={width} onChange={(e) => setWidth(e.target.value)} />
        </label>
        <label>
          Height:
          <input value={height} onChange={(e) => setHeight(e.target.value)} />
        </label>
      </div>
      <img width={width} height={height} src={image} alt={"ScreenShot"} />
      <div
        ref={ref}
        style={{
        //   border: "1px solid #ccc",
          padding: "10px",
        //   marginTop: "20px",
        }}
      ></div>
    </div>
  );
};

export default Image;
