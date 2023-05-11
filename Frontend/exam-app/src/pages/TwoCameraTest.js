import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const TwoCameraTestPage = () => {
  const [imageDataURL1, setImageDataURL1] = useState(null);
  const [imageDataURL2, setImageDataURL2] = useState(null);
  const [cameraNumber1, setCameraNumber1] = useState(1);
  const [cameraNumber2, setCameraNumber2] = useState(0);
  const [switchCameraFlag, setSwitchCameraFlag] = useState(false);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const player1Ref = useRef();
  const player2Ref = useRef();

  useEffect(() => {
    setPlayer1(player1Ref.current);
    setPlayer2(player2Ref.current);
  }, []);

  useEffect(() => {
    if (player1 !== null && player2 !== null) {
      let MediaDevices = navigator.mediaDevices;
      MediaDevices.enumerateDevices().then((devices) => {
        console.log(devices);
      });
    }
  }, [player1]);

  useEffect(() => {
    if (switchCameraFlag) {
      if (cameraNumber1 === 0) {
        setCameraNumber1(1);
        setCameraNumber2(0);
        initializeMedia(1, 0);
      } else if (cameraNumber1 === 1) {
        setCameraNumber1(0);
        setCameraNumber2(1);
        initializeMedia(0, 1);
      }
      setSwitchCameraFlag(false);
    }
  }, [switchCameraFlag]);

  useEffect(() => {
    console.log("cameraNumber1: ", cameraNumber1);
    console.log("cameraNumber2: ", cameraNumber2);
  }, [cameraNumber1]);

  let initializeMedia = async (cameraNumber1, cameraNumber2) => {
    setImageDataURL1(null);
    setImageDataURL2(null);

    if (!("mediaDevices" in navigator)) {
      navigator.mediaDevices = {};
    }

    if (!("getUserMedia" in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error("getUserMedia Not Implemented"));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    //Get the details of video inputs of the device
    const videoInputs = await getListOfVideoInputs();

    //The device has a camera
    if (videoInputs.length) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: {
              exact: videoInputs[cameraNumber1].deviceId,
            },
            width: 200,
            height: 200,
          },
        })
        .then((stream) => {
          player1.srcObject = stream;
        })
        .catch((error) => {
          console.error(error);
        });
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: {
              exact: videoInputs[cameraNumber2].deviceId,
            },
            width: 200,
            height: 200,
          },
        })
        .then((stream) => {
          player2.srcObject = stream;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("The device does not have a camera");
    }
  };

  let capturePicture = () => {
    var canvas1 = document.createElement("canvas");
    canvas1.width = player1.videoWidth;
    canvas1.height = player1.videoHeight;
    var contex1 = canvas1.getContext("2d");
    contex1.drawImage(player1, 0, 0, canvas1.width, canvas1.height);
    player1.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    // console.log(canvas.toDataURL());
    setImageDataURL1(canvas1.toDataURL());

    var canvas2 = document.createElement("canvas");
    canvas2.width = player2.videoWidth;
    canvas2.height = player2.videoHeight;
    var contex2 = canvas2.getContext("2d");
    contex2.drawImage(player2, 0, 0, canvas2.width, canvas2.height);
    player2.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    // console.log(canvas.toDataURL());
    setImageDataURL2(canvas2.toDataURL());
  };

  let switchCamera = async () => {
    const listOfVideoInputs = await getListOfVideoInputs();

    // The device has more than one camera
    if (listOfVideoInputs.length > 1) {
      if (player1.srcObject) {
        player1.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
      if (player2.srcObject) {
        player2.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }

      // switch to second camera
      setSwitchCameraFlag(true);
      console.log(cameraNumber1);

      // Restart based on camera input
    } else if (listOfVideoInputs.length === 1) {
      alert("The device has only one camera");
    } else {
      alert("The device does not have a camera");
    }
  };

  let getListOfVideoInputs = async () => {
    // Get the details of audio and video output of the device
    const enumerateDevices = await navigator.mediaDevices.enumerateDevices();

    //Filter video outputs (for devices with multiple cameras)
    return enumerateDevices.filter((device) => device.kind === "videoinput");
  };

  const playerORImage1 = Boolean(imageDataURL1) ? (
    <img src={imageDataURL1} alt="cameraPic" />
  ) : (
    <video ref={player1Ref} autoPlay></video>
  );
  const playerORImage2 = Boolean(imageDataURL2) ? (
    <img src={imageDataURL2} alt="cameraPic" />
  ) : (
    <video ref={player2Ref} autoPlay></video>
  );

  return (
    <div className="Camera">
      {playerORImage1}
      {playerORImage2}
      <button onClick={() => initializeMedia(1, 0)}>Take Photo</button>
      <button onClick={capturePicture}>Capture</button>
      <button onClick={switchCamera}>Switch</button>
      <Link to="/profile" state={imageDataURL1}>
        <button>Save to Profile</button>
      </Link>
    </div>
  );
};

export default TwoCameraTestPage;
