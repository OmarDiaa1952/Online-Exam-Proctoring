import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const host = "http://157.230.113.71:5000/";
const localhost = "http://localhost:5000";
const URL = process.env.NODE_ENV === "production" ? undefined : localhost;

export const socket = io(URL, { autoConnect: false });
