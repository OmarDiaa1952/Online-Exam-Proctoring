import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const OPSR = 16000;
const INSR = 44100;
const skipped =
  "to|from|in|on|at|of|a|an|is|are|i|we|you|she|he|it|was|were|do|does|this|those|these|my|his|her|its|him|has|the|have|what|when|where|who|whose|which|how|then|for";
const regex = new RegExp(
  skipped
    .split("|")
    .map((v) => `\\b${v}\\b`)
    .join("|"),
  "g"
);

const host = "http://157.230.113.71:5000";
const localhost = "http://localhost:5000";
const URL = process.env.NODE_ENV === "production" ? host : localhost;

const socket = io(URL, { autoConnect: false });

/**
 * Record audio from mic and send it to server for cheating detection
 * @param {onCheatingHandler} onCheating
 * @param {useMicOpt} opt
 */
function useMic(onCheating, { onLog, timeslice = 5000 } = {}) {
  const [isRec, setIsRec] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [data, setData] = useState(null);
  const [examText, setExamText] = useState("<EXAM-TEXT>");

  const context = new AudioContext({ sampleRate: INSR });

  //-------------------- USE EFFECTS START --------------------//

  // Socket managment
  useEffect(() => {
    // Socket io
    if (!socket.connected) socket.connect();

    socket.on("connected", (data) => console.log("Connected"));
    socket.on("isCheating", onCheating);
    if (onLog !== undefined) socket.on("log", onLog);

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send audio to the server
  useEffect(() => {
    if (isRec && data) {
      console.log("Data sent to server");
      socket.emit("data", data);
    }
  }, [data, isRec]);

  // Start and end recording, and manage frequent recording calls
  useEffect(() => {
    if (isRec && !recorder) startRecording();
    else if (!isRec && recorder) {
      setRecorder(null);
      setData(null);
      stopRecording(recorder);
    } else if (isRec && recorder) {
      setTimeout(() => {
        stopRecording(recorder);
      }, timeslice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRec, recorder]);

  //--------------------- USE EFFECTS END ---------------------//

  //------------------- RESAMPLE AUDIO START ------------------//

  /**
   * Resample audio buffer
   * @param {AudioBuffer} audioBuffer
   */
  function resample(audioBuffer) {
    const old_sr = audioBuffer.sampleRate;
    const old_length = audioBuffer.length;

    const new_length = (old_length * OPSR) / old_sr;

    const offlineContext = new OfflineAudioContext(1, new_length, OPSR);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    offlineContext.oncomplete = function ({ renderedBuffer }) {
      const audio_blob = renderedBuffer.getChannelData(0);
      const keywords = getKeywords(examText);
      const data = { audio_blob, keywords };
      setData(data);
    };

    source.connect(offlineContext.destination);
    source.start(0);
    offlineContext.startRendering();
  }

  //-------------------- RESAMPLE AUDIO END -------------------//

  //--------------------- RECORDING START ---------------------//

  /**
   * Start recording
   */
  async function startRecording() {
    const opt = { audio: { sampleRate: INSR, channelCount: 1 } };
    const stream = await navigator.mediaDevices.getUserMedia(opt);
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = async function ({ data }) {
      if (isRec) {
        const opt = { type: "audio/wav" };
        const recordedAudio = new Blob([data], opt);
        const buffer = await recordedAudio.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(buffer);
        resample(audioBuffer);
      }
    };
    recorder.start();
    setRecorder(recorder);
  }

  /**
   * Stop recording
   * @param {MediaRecorder} recorder
   */
  function stopRecording(recorder) {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      if (isRec) startRecording();
    }
  }

  //---------------------- RECORDING END ----------------------//

  //--------------------- KEYWORDS START ----------------------//

  /**
   * Get keywords
   * @param {String} str
   */
  function getKeywords(str) {
    let arr = str
      .toLowerCase()
      .replace(regex, "")
      .replace(/\?|\.|\(|\)|\\|\//g, "")
      .replace(/\s\s+/g, " ")
      .trim()
      .split(" ");
      arr = [...new Set(arr.filter(word=>Boolean(word)))];
      console.log(arr);
      return arr;
  }
  //---------------------- KEYWORDS END -----------------------//

  /**
   * Initializing recording
   * @param {String} examText
   */
  async function init(examText) {
    if (context.state === "suspended") await context.resume();
    setIsRec(true);
    setExamText(examText);
  }

  /**
   * Stop recording
   */
  function stop() {
    setIsRec(false);
    stopRecording();
  }

  /**
   * Change question
   * @param {String} examText
   */
  function changeQuestion(examText) {
    setExamText(examText);
  }
  return { init, stop, changeQuestion };
}

export default useMic;

/**
 * @typedef {Object} useMicOpt
 * @property {onLogHandler} onLog
 * @property {Number} timeslice timeslice of each time slice in ms
 */

/**
 * Callback function called when cheating is detected.
 * @callback onCheatingHandler
 * @param {string} text The transcribed text with [] around suspicious words
 * @returns {void}
 */

/**
 * Callback function called when cheating is detected.
 * @callback onLogHandler
 * @param {logResults} results
 * @returns {void}
 */

/**
 * @typedef {Object} logResults
 * @property {String} text transcribed text
 * @property {performanceRecords} perf Info about the model performance
 */

/**
 * @typedef {Object} performanceRecords
 * @property {Number} feature_extraction Time taken for feature extraction
 * @property {Number} encoding Time taken for encoding
 * @property {Number} decoding Time taken for decoding
 * @property {Number} total_time Total time taken for transcription
 * @property {Boolean} timeout Whether the processing timed out
 */
