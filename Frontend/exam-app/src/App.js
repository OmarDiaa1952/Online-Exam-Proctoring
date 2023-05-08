import { Route, Routes } from "react-router-dom";

import WelcomePage from "./pages/Welcome";
import RegistrationPage from "./pages/Registration";
import HomePage from "./pages/Home";
import ModifyCoursePage from "./pages/ModifyCourse";
import CoursePage from "./pages/Course";
import CourseDetailsPage from "./pages/CourseDetails";
import ExamPage from "./pages/Exam";
import ExamDetailsPage from "./pages/ExamDetails";
import EditExamPage from "./pages/EditExam";
import LogFilePage from "./pages/LogFile";
import ReviewExamPage from "./pages/ReviewExam";
import PreviewExamPage from "./pages/PreviewExam";
import PrivateRoute from "./utils/PrivateRoute";
import Camera from "./utils/Camera";
import WebcamStreamCapture from "./utils/WebcamStreamCapture";
import ProfilePage from "./pages/Profile";
import CourseStudentsPage from "./pages/CourseStudents";

function App() {
  return (
    <Routes>
      <Route path="/welcome" exact element={<WelcomePage />} />
      <Route path="/register" exact element={<RegistrationPage />} />
      <Route exact path="/" element={<PrivateRoute />}>
        <Route exact path="/" element={<HomePage />} />
      </Route>
      <Route path="/profile" exact element={<ProfilePage />} />
      <Route path="/modify-course" exact element={<ModifyCoursePage />} />
      <Route path="/course" exact element={<CoursePage />} />
      <Route path="/course-students" exact element={<CourseStudentsPage />} />
      <Route path="/course-details" exact element={<CourseDetailsPage />} />
      <Route path="/exam" exact element={<ExamPage />} />
      <Route path="/exam-details" exact element={<ExamDetailsPage />} />
      <Route path="/edit-exam" exact element={<EditExamPage />} />
      <Route path="/review-exam" exact element={<ReviewExamPage />} />
      <Route path="/Preview-exam" exact element={<PreviewExamPage />} />
      <Route path="/log-file" exact element={<LogFilePage />} />
      <Route path="/camera" exact element={<Camera />} />
      <Route path="/stream" exact element={<WebcamStreamCapture />} />
    </Routes>
  );
}

export default App;
