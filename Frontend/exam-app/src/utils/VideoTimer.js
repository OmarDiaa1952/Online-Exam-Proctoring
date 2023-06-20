import React, { useState, useEffect } from "react";

const VideoTimer = (props) => {
  const [seconds, setSeconds] = useState(20);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (props.startRecording) {
      setIsActive(true);
    }
  }, [props.startRecording]);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (!isActive) {
        return;
      }
      if (seconds === 0) {
        props.stopRecording();
        return;
      } else {
        setSeconds((seconds) => seconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, isActive]);

  return (
    <div>
      <div>
        {props.text}
        <span className="border border-warning rounded p-1 m-2">
          {seconds < 10 ? "0" + String(seconds) : seconds}:00
        </span>
        seconds
      </div>
    </div>
  );
};

export default VideoTimer;
