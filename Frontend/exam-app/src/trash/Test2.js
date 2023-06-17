import React, { useState } from "react";

function Test2() {
    const [cameraNumber, setCameraNumber] = useState(0);
    const [imageDataURL, setImageDataURL] = useState(null);

   let initializeMedia = async () => {
        setImageDataURL(null);
    
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
    
        // //Get the details of video inputs of the device
        // const videoInputs = await getListOfVideoInputs();
    
        // //The device has a camera
        // if (videoInputs.length) {
        //   navigator.mediaDevices
        //     .getUserMedia({
        //       video: {
        //         deviceId: {
        //           exact: videoInputs[cameraNumber].deviceId,
        //         },
        //       },
        //     })
        //     .then((stream) => {
        //       React.player.srcObject = stream;
        //     })
        //     .catch((error) => {
        //       console.error(error);
        //     });
        // } else {
        //   alert("The device does not have a camera");
        // }
      };

  let getListOfVideoInputs = async () => {
    // Get the details of audio and video output of the device
    const enumerateDevices = await navigator.mediaDevices.enumerateDevices();

    //Filter video outputs (for devices with multiple cameras)
    return enumerateDevices.filter((device) => device.kind === "videoinput");
  };

  let switchCamera = async () => {
    const listOfVideoInputs = await this.getListOfVideoInputs();

    // The device has more than one camera
    if (listOfVideoInputs.length > 1) {
      if (React.player.srcObject) {
        React.player.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }

      // switch to second camera
      if (cameraNumber === 0) {
        setCameraNumber(1);
      }
      // switch to first camera
      else if (cameraNumber === 1) {
        setCameraNumber(0);
      }

      // Restart based on camera input
      initializeMedia();
    } else if (listOfVideoInputs.length === 1) {
      alert("The device has only one camera");
    } else {
      alert("The device does not have a camera");
    }
  };

  return <div>
    <button onClick={initializeMedia}>Take Photo</button>
    <button onClick={switchCamera}>Switch</button>
  </div>;
}

export default Test2;
