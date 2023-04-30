import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function UseWindowDimensions(props) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const [maxWindowDimensions, setMaxWindowDimensions] = useState({
    maxWidth: window.innerWidth,
    maxHeight: window.innerHeight,
  });

  const [windowStatus, setWindowStatus] = useState("fullScreen");
  const [initialized, setInitialized] = useState(false);

  let fullScreenWarningDiv = (
    <div>
      <p>
        Warning, It is prefered to use full screen mode for the exam. If you
        want to use full screen mode, please click on F11 button.
      </p>
    </div>
  );

  let maximizedWarningDiv = (
    <div>
      <p>
        Warning, You must keep the window maximized otherwise the exam will be
        ended!
      </p>
    </div>
  );

  useEffect(() => {}, [windowStatus]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      if (
        maxWindowDimensions.maxWidth < window.innerWidth ||
        maxWindowDimensions.maxHeight < window.innerHeight
      ) {
        setMaxWindowDimensions({
          maxWidth: window.innerWidth,
          maxHeight: window.innerHeight,
        });
      }
      if (!initialized) {
        wait();
        setInitialized(true);
        return;
      }
      if (
        window.innerWidth === maxWindowDimensions.maxWidth &&
        window.innerHeight === maxWindowDimensions.maxHeight
      ) {
        setWindowStatus("fullScreen");
        props.onChangeWindowDimensions(1);
        console.log("window is in full Screen");
      } else if (
        window.screen.availWidth === window.outerWidth &&
        window.screen.availHeight === window.outerHeight
      ) {
        setWindowStatus("maximized");
        props.onChangeWindowDimensions(1);
        console.log("Window is maximized");
      } else {
        setWindowStatus("notMaximized");
        props.onChangeWindowDimensions(0);
        console.log("window is not maximized");
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowDimensions, initialized]);

  let wait = async () => {
    await timeout(100);
  };

  let timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  function getDimensions() {
    console.log("availWidth: " + window.screen.availWidth);
    console.log("availHeight: " + window.screen.availHeight);
    console.log("outerWidth: " + window.outerWidth);
    console.log("outerHeight: " + window.outerHeight);
    console.log("width: " + window.screen.width);
    console.log("height: " + window.screen.height);
    console.log("innerWidth: " + window.innerWidth);
    console.log("innerHeight: " + window.innerHeight);
    console.log("maxWidth: " + maxWindowDimensions.maxWidth);
    console.log("maxHeight: " + maxWindowDimensions.maxHeight);
  }

  return (
    <div>
      {windowStatus === "maximized"
        ? fullScreenWarningDiv
        : windowStatus === "notMaximized"
        ? maximizedWarningDiv
        : null}
    </div>
  );
}
