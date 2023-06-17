import React, { useState, useEffect } from "react";

const Timer = (props) => {
  const [seconds, setSeconds] = useState(props.seconds);
  const [minutes, setMinutes] = useState(props.minutes);
  const [hours, setHours] = useState(props.hours);

  useEffect(() => {
    console.log("seconds: ", seconds);
    console.log("minutes: ", minutes);
    console.log("hours: ", hours);
    if(!props.seconds) return;
    let interval = null;
    interval = setInterval(() => {
      if (seconds === 0 && minutes === 0 && hours === 0) {
        props.onTimeOut();
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

  useEffect(() => {
    console.log("Update Timer");
    if(!props.seconds) return;
    setSeconds(props.seconds);
    setMinutes(props.minutes);
    setHours(props.hours);
  }, [props.minutes]);

  let getTime = () => {
    console.log("seconds: ", props.seconds);
    console.log("minutes: ", props.minutes);
    console.log("hours: ", props.hours);
  };

  return (
    <div>
      <button onClick={getTime}>Get Time</button>
      {props.seconds ? (
        <div>
          Remaining time: {hours < 10 ? "0" + String(hours) : hours} :{" "}
          {minutes < 10 ? "0" + String(minutes) : minutes} :{" "}
          {seconds < 10 ? "0" + String(seconds) : seconds}
        </div>
      ) : (
        <div>Remaining time: ?? : ?? : ??</div>
      )}
    </div>
  );
};

export default Timer;
