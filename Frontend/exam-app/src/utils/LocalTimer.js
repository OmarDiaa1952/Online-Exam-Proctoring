import React, { useState, useEffect } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(34);
  const [hours, setHours] = useState(19);

  useEffect(() => {
    console.log("seconds: ", seconds);
    console.log("minutes: ", minutes);
    console.log("hours: ", hours);
    // if(!props.seconds) return;
    let interval = null;
    interval = setInterval(() => {
      if (seconds === 0 && minutes === 0 && hours === 0) {
        // props.onTimeOut();
        return;
      } else if (seconds === 0 && minutes === 0) {
        setSeconds(59);
        setMinutes(59);
        setHours(hours - 1);
        return;
      } else if (seconds === 0) {
        setSeconds(59);
        setMinutes(minutes - 1);
        setHours(hours);
        console.log("from else if");
        return;
      } else {
        console.log("from else");
        setSeconds((seconds) => seconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);


  let getTime = () => {
    console.log("seconds: ", seconds);
    console.log("minutes: ", minutes);
    console.log("hours: ", hours);
  };

  return (
    <div>
      <button onClick={getTime}>Get Time</button>
        <div>
          Local Timer: {hours < 10 ? "0" + String(hours) : hours} :{" "}
          {minutes < 10 ? "0" + String(minutes) : minutes} :{" "}
          {seconds < 10 ? "0" + String(seconds) : seconds}
        </div>
    </div>
  );
};

export default Timer;
