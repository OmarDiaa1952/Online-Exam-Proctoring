import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function UseWindowDimensions(props) {
  const navigate = useNavigate();

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const [maxWindowDimensions, setMaxWindowDimensions] = useState({
    maxWidth: window.innerWidth,
    maxHeight: window.innerHeight,
  });

  const [windowStatus, setWindowStatus] = useState("fullScreen");
  const [initialized, setInitialized] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(5);

  let fullScreenWarningDiv = (
    <div className="card fixed-top">
      <p>
        Warning, It is prefered to use full screen mode for the exam. If you
        want to use full screen mode, please click on F11 button.
      </p>
    </div>
  );

  let maximizedWarningDiv = (
    <div className="card fixed-top">
      <p>
        Warning, You must keep the window maximized otherwise the exam will be
        ended! Please return to the maximized window in {remainingSeconds}{" "}
        seconds.
      </p>
    </div>
  );

  // useEffect(() => {
  //   setRemainingSeconds(5);
  // }, [windowStatus]);

  // useEffect(() => {
  //   let interval = null;
  //   interval = setInterval(() => {
  //     if (remainingSeconds === 0) navigate("/exam-details");
  //     else if (windowStatus === "notMaximized")
  //       setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
  //     else setRemainingSeconds(5);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [remainingSeconds, windowStatus]);
  useEffect(() => {
    if (remainingSeconds === 0) navigate("/exam-details");
    else if (windowStatus === "notMaximized")
      delay(1).then(() => {
      setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
    });
    else setRemainingSeconds(5);
  }, [remainingSeconds, windowStatus]);

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  let delay = async (seconds) => {
    await timeout(1000 * seconds);
  };

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
