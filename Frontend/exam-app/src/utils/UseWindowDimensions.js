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
    }
    console.log(windowDimensions);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <h1>Window Dimensions</h1>
      <p>Width: {windowDimensions.width}</p>
      <p>Height: {windowDimensions.height}</p>
    </div>
  );
}
