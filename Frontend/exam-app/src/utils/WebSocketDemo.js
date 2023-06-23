import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "../store/user-context";

export default function WebSocketDemo(props) {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [delayImg, setDelayImg] = useState(false);
  const [delayImg2, setDelayImg2] = useState(false);
  const socketRef = useRef(null);

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  let delay = async (seconds, func) => {
    await timeout(1000 * seconds);
    func(true);
  };

  useEffect(() => {
    if(!socketRef.current || !props.imgUrl) return;
    else if (!delayImg) {
      delay(4, setDelayImg);
      return;
    }
    const imgUrl = { type: "photo", photo_data: props.imgUrl };
    socketRef.current.send(JSON.stringify(imgUrl));
  }, [props.imgUrl]);

  useEffect(() => {
    if(!socketRef.current || !props.imgUrl2) return;
    else if (!delayImg2) {
      delay(6, setDelayImg2);
      return;
    }
    const imgUrl2 = { type: "photo2", photo_data: props.imgUrl2 };
    socketRef.current.send(JSON.stringify(imgUrl2));
  }, [props.imgUrl2]);

  useEffect(() => {
    if(!socketRef.current || props.focus === null) return;
    const warningMsg = { type: "focus_status", is_focused: props.focus && props.windowDimensionsFlag === 1 };
    console.log("warningMsg: ", warningMsg);
    socketRef.current.send(JSON.stringify(warningMsg));
  }, [props.focus, props.windowDimensionsFlag]);

  useEffect(() => {
    if (props.changeAnswerId === null) return;
    const message = {
      type: "change_answer",
      question_id: props.changeAnswerId.split("-")[0],
      choice: props.changeAnswerId.split("-")[1],
    };
    console.log("message: ", message);
    socketRef.current.send(JSON.stringify(message));
  }, [props.changeAnswerId]);

  useEffect(() => {
    props.updateTimer(remainingTime);
  }, [seconds]);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket("ws://localhost:8000/ws/exam/" + userCtx.examId + "/?token=" + userCtx.authTokens.access);

    // Define event handlers
    socketRef.current.onopen = () => {
      // Send a message to start the exam
      const message = { type: "start_exam" };
      socketRef.current.send(JSON.stringify(message));
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const messageType = message.type;

      if (messageType === "timer") {
        // Update the remaining time
        setRemainingTime(message.remaining_time);
        setMinutes(message.remaining_time.split(":")[1]);
        setSeconds(message.remaining_time.split(":")[2]);
        console.log(`Received message: ${event.data}`);
      } else if (messageType === "exam_ended") {
        // End the exam session
        socketRef.current.close();
        navigate("/course")
      } else {
        console.log(`Received message: ${event.data}`);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error(`Error: ${error}`);
    };

    socketRef.current.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="card bg-warning fixed-bottom d-flex flex-row justify-content-center">
      {remainingTime && <p className="fs-3">Remaining time: {remainingTime}</p>}
         
    </div>
  );
}