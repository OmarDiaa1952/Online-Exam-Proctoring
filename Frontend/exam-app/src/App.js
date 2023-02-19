import { Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<WelcomePage />} />
    </Routes>
  );
}

export default App;
