import { Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/Welcome";
import RegistrationPage from "./pages/Registration";

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<WelcomePage />} />
      <Route path="/register" exact element={<RegistrationPage />} />
    </Routes>
  );
}

export default App;
