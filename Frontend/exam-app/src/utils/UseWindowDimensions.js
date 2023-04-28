import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function UseWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    console.log(window.screen.availWidth);
    console.log(window.screen.availHeight);
    console.log(window.screen.width);
    console.log(window.screen.height);
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      CheckWindow();
    }
    console.log(windowDimensions);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function CheckWindow() {

    var A = window.screen.availWidth;
    var AA = window.outerWidth;
  
    var B = window.screen.availHeight;
    var BB = window.outerHeight;
    
    if (A === AA && B === BB) {
    
      console.log("Window is maximized or in full screen");
  
    }
     
    else {
     
      console.log("Window is not maximized or in full screen");
      
     }
  
  }

  return (
    <div>
      <h1>Window Dimensions</h1>
      <p>Width: {windowDimensions.width}</p>
      <p>Height: {windowDimensions.height}</p>
    </div>
  );
}
