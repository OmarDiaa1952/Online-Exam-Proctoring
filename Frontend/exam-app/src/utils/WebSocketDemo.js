import { useState, useEffect, useRef, useContext } from "react";

import UserContext from "../store/user-context";

export default function WebSocketDemo(props) {
  const userCtx = useContext(UserContext);
  const [remainingTime, setRemainingTime] = useState(null);
  const socketRef = useRef(null);
  useEffect(() => {
    if(!socketRef.current || !props.imgUrl) return;
    const imgUrl = { type: "photo", photo_data: props.imgUrl };
    socketRef.current.send(JSON.stringify(imgUrl));
  }, [props.imgUrl]);

  useEffect(() => {
    if(!socketRef.current || props.windowDimensionsFlag === null) return;
    const warningMsg = { type: "window_status", is_maximized: props.windowDimensionsFlag === 1 };
    console.log("warningMsg: ", warningMsg);
    socketRef.current.send(JSON.stringify(warningMsg));
  }, [props.windowDimensionsFlag]);

  useEffect(() => {
    if(!socketRef.current || props.focus === null) return;
    const warningMsg = { type: "focus_status", is_focused: props.focus };
    console.log("warningMsg: ", warningMsg);
    socketRef.current.send(JSON.stringify(warningMsg));
  }, [props.focus]);

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
        console.log(`Received message: ${event.data}`);
      } else if (messageType === "exam_ended") {
        // End the exam session
        socketRef.current.close();
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
    <div>
      {remainingTime && <p>Remaining time: {remainingTime}</p>}
      {/* your app code here */}
         
    </div>
  );
}