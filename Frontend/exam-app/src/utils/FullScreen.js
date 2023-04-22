import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "../store/user-context";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function FullScreen(props) {
  // const [timeoutFlag, setTimeoutFlag] = useState(false);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  function getBrowserFullscreenElementProp() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      document.documentElement.requestFullscreen();
    }
    setFlag(true);
    // if (typeof document.fullscreenElement !== "undefined") {
    //   console.log("fullscreenElement");
    // } else if (typeof document.mozFullScreenElement !== "undefined") {
    //   console.log("mozFullScreenElement");
    // } else if (typeof document.msFullscreenElement !== "undefined") {
    //   console.log("msFullscreenElement");
    // } else if (typeof document.webkitFullscreenElement !== "undefined") {
    //   console.log("webkitFullscreenElement");
    // } else {
    //   throw new Error("fullscreenElement is not supported by this browser");
    // }
    // if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if (document.msExitFullscreen) {
    //     document.msExitFullscreen();
    //   } else if (document.mozCancelFullScreen) {
    //     document.mozCancelFullScreen();
    //   } else if (document.webkitExitFullscreen) {
    //     document.webkitExitFullscreen();
    //   }
  }

  let checkFullScreen = async () => {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement &&
      flag
    ) {
    }
    // await timeout(1000);
    // setTimeoutFlag(!timeoutFlag);
  }

  function exitHandler() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      //   getBrowserFullscreenElementProp();
      document.documentElement.requestFullscreen();
      console.log("exit");
    }
  }
  useEffect(() => {
    getBrowserFullscreenElementProp();
  }, []);

  useEffect(() => {
    checkFullScreen();
    // if (document.addEventListener) {
    //   document.addEventListener("fullscreenchange", exitHandler, false);
    //   document.addEventListener("mozfullscreenchange", exitHandler, false);
    //   document.addEventListener("MSFullscreenChange", exitHandler, false);
    //   document.addEventListener("webkitfullscreenchange", exitHandler, false);
    // }
    // function CheckWindow() {
    //   var A = screen.availWidth;
    //   var AA = window.outerWidth;

    //   var B = screen.availHeight;
    //   var BB = window.outerHeight;

    //   if (A === AA && B === BB) {
    //     console.log("Full Screen");
    //   } else {
    //     console.log("Not Full Screen");
    //   }
    // }
  }, [windowDimensions.width, windowDimensions.height]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    console.log(windowDimensions);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //   function toggleFullScreen() {
  //     if (!document.fullscreenElement) {
  //       document.documentElement.requestFullscreen();
  //     }
  //   }
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <div>
      {/* <button onClick={toggleFullScreen}>Toggle Full Screen</button> */}
    </div>
  );
}

export default FullScreen;
