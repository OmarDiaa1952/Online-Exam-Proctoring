import React from "react";
import { Link } from "react-router-dom";

class TwoCameraPage extends React.Component {
  constructor() {
    super();

    this.cameraNumber = 0;
    this.cameraNumber2 = 1;

    this.state = {
      imageDataURL: null,
      imageDataURL2: null,
    };
  }

  initializeMedia = async () => {
    this.setState({ imageDataURL: null });
    this.setState({ imageDataURL2: null });

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
    const videoInputs = await this.getListOfVideoInputs();

    //The device has a camera
    if (videoInputs.length) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: {
              exact: videoInputs[this.cameraNumber].deviceId,
            },
          },
        })
        .then((stream) => {
          this.player.srcObject = stream;
        })
        .catch((error) => {
          console.error(error);
        });
        navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: {
              exact: videoInputs[this.cameraNumber2].deviceId,
            },
          },
        })
        .then((stream) => {
          this.player2.srcObject = stream;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("The device does not have a camera");
    }
  };

  capturePicture = () => {
    var canvas = document.createElement("canvas");
    canvas.width = this.player.videoWidth;
    canvas.height = this.player.videoHeight;
    var contex = canvas.getContext("2d");
    contex.drawImage(this.player, 0, 0, canvas.width, canvas.height);
    this.player.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    // console.log(canvas.toDataURL());
    this.setState({ imageDataURL: canvas.toDataURL() });

    var canvas2 = document.createElement("canvas");
    canvas2.width = this.player2.videoWidth;
    canvas2.height = this.player2.videoHeight;
    var contex2 = canvas2.getContext("2d");
    contex2.drawImage(this.player2, 0, 0, canvas2.width, canvas2.height);
    this.player2.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });
    // console.log(canvas.toDataURL());
    this.setState({ imageDataURL2: canvas2.toDataURL() });
  };

  switchCamera = async () => {
    const listOfVideoInputs = await this.getListOfVideoInputs();

    // The device has more than one camera
    if (listOfVideoInputs.length > 1) {
      if (this.player.srcObject) {
        this.player.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
      if (this.player2.srcObject) {
        this.player2.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }

      // switch to second camera
      if (this.cameraNumber === 0) {
        this.cameraNumber = 1;
        this.cameraNumber2 = 0;
      }
      // switch to first camera
      else if (this.cameraNumber === 1) {
        this.cameraNumber = 0;
        this.cameraNumber2 = 1;
      }
      console.log(this.cameraNumber);

      // Restart based on camera input
      this.initializeMedia();
    } else if (listOfVideoInputs.length === 1) {
      alert("The device has only one camera");
    } else {
      alert("The device does not have a camera");
    }
  };

  getListOfVideoInputs = async () => {
    // Get the details of audio and video output of the device
    const enumerateDevices = await navigator.mediaDevices.enumerateDevices();

    //Filter video outputs (for devices with multiple cameras)
    return enumerateDevices.filter((device) => device.kind === "videoinput");
  };

  render() {
    const playerORImage = Boolean(this.state.imageDataURL) ? (
      <img src={this.state.imageDataURL} alt="cameraPic" />
    ) : (
      <video
        ref={(refrence) => {
          this.player = refrence;
        }}
        autoPlay
      ></video>
      
    );
    const playerORImage2 = Boolean(this.state.imageDataURL2) ? (
      <img src={this.state.imageDataURL2} alt="cameraPicture" />
    ) : (
      <video
        ref={(refrence) => {
          this.player2 = refrence;
        }}
        autoPlay
      ></video>
      );
  
    return (
      <div className="Camera">
        {playerORImage}
        <button onClick={this.initializeMedia}>Take Photo</button>
        <button onClick={this.capturePicture}>Capture</button>
        <button onClick={this.switchCamera}>Switch</button>
        {playerORImage2}
        <Link to="/profile" state={this.state.imageDataURL}><button>Save to Profile</button></Link>
      </div>
    );
  }
}

export default TwoCameraPage;
