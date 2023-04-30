import { useEffect } from "react";

function FullScreen() {
  function getBrowserFullscreenElementProp() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      document.documentElement.requestFullscreen();
    }
  }

  useEffect(() => {
    getBrowserFullscreenElementProp();
  }, []);

  return <div></div>;
}

export default FullScreen;
