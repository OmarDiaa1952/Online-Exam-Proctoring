import { Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/Welcome";
import RegistrationPage from "./pages/Registration";
import HomePage from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<WelcomePage />} />
      <Route path="/register" exact element={<RegistrationPage />} />
      <Route path="/home" exact element={<HomePage />} />
    </Routes>
  );
}

export default App;
