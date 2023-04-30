import React, { useState, useEffect } from "react";

const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(props.minutes);
  const [hours, setHours] = useState(props.hours);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (seconds === 0 && minutes === 0 && hours === 0) {
        props.onTimeOut();
        return;
      } else if (seconds === 0 && minutes === 0) {
        setHours((hours) => hours - 1);
        setMinutes(59);
        setSeconds(59);
        return;
      } else if (seconds === 0) {
        setMinutes((minutes) => minutes - 1);
        setSeconds(59);
        return;
      } else {
        setSeconds((seconds) => seconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, minutes, hours]);

  return (
    <div>
      Remaining time: {hours < 10 ? "0" + String(hours) : hours} :{" "}
      {minutes < 10 ? "0" + String(minutes) : minutes} :{" "}
      {seconds < 10 ? "0" + String(seconds) : seconds}
    </div>
  );
};

export default Timer;
