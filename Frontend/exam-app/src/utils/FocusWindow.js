import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWindowFocus from "./useWindowFocus";

const FocusWindow = (props) => {
  const navigate = useNavigate();
  const windowFocused = useWindowFocus();
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (remainingSeconds === 0) navigate("/exam-details");
      else if (!windowFocused)
        setRemainingSeconds((remainingSeconds) => remainingSeconds - 1);
      else setRemainingSeconds(5);
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingSeconds, windowFocused]);
  useEffect(() => {
    props.onChangeFocus(windowFocused);
  }, [windowFocused]);
  return (
    <div>
      {!windowFocused && (
        <p>
          Warning, Please return instantly to the exam otherwise the exam will
          be ended! The exam will be closed in {remainingSeconds} seconds
        </p>
      )}
    </div>
  );
};

export default FocusWindow;
