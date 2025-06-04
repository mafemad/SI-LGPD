// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ImportPage from "./pages/ImportPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/portability/callback" element={<PortabilityCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
