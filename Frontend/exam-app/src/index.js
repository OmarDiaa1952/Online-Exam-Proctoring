import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./store/user-context";
import { CourseContextProvider } from "./store/course-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CourseContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </CourseContextProvider>
  </BrowserRouter>
);
