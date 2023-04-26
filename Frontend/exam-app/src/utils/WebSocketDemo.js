import { useState, useEffect, useRef } from "react";

export default function WebSocketDemo() {
  //   const [isPaused, setPause] = useState(false);
  //   const ws = useRef(null);

  //   useEffect(() => {
  //     ws.current = new WebSocket("ws://localhost:8000/ws/exam/7/1/");
  //     ws.current.onopen = () => console.log("ws opened");
  //     ws.current.onclose = () => console.log("ws closed");

  //     const wsCurrent = ws.current;

  //     return () => {
  //       wsCurrent.close();
  //     };
  //   }, []);

  //   useEffect(() => {
  //     if (!ws.current) return;
  //     let i = 0;
  //     for (; i < 1000000; i++) {
  //       ws.current.onmessage = (e) => {
  //         if (isPaused) return;
  //         const message = JSON.parse(e.data);
  //         console.log("e", message);
  //       };
  //     }
  //   }, [isPaused]);

  //   useEffect(() => {
  //     const socket = new WebSocket("ws://localhost:8000/ws/exam/2/1/");
  //     socket.addEventListener("message", (event) => {
  //       console.log("Message from server ", event.data);
  //     });
  //   }, []);

  //   const socketRef = useRef(null);

  //   useEffect(() => {
  //     // Connect to the WebSocket server
  //     socketRef.current = new WebSocket("ws://localhost:8000/ws/exam/7/1/");

  //     // Define event handlers
  //     socketRef.current.onopen = () => {
  //       // Send a message to start the exam
  //       const message = { type: "start_exam" };
  //       socketRef.current.send(JSON.stringify(message));
  //     };

  //     socketRef.current.onmessage = (event) => {
  //       console.log(`Received message: ${event.data}`);
  //     };

  //     socketRef.current.onerror = (error) => {
  //       console.error(`Error: ${error}`);
  //     };

  //     socketRef.current.onclose = (event) => {
  //       console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
  //     };

  //     // Clean up the WebSocket connection when the component unmounts
  //     return () => {
  //       if (socketRef.current) {
  //         socketRef.current.close();
  //       }
  //     };
  //   }, []);

  //   return (
  //     <div>
  //       {/* <button onClick={() => setPause(!isPaused)}>
  //         {isPaused ? "Resume" : "Pause"}
  //       </button> */}
  //     </div>
  //   );

  const [remainingTime, setRemainingTime] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket("ws://localhost:8000/ws/exam/7/1/");

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