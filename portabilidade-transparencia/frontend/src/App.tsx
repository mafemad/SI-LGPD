// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import {UserDashboard} from "./pages/UserDashboard";
import { UserEdit } from "./pages/UserEdit";
import Index from "./pages/Index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/portabilidade/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/usuario" element={<UserDashboard />} />
        <Route path="/sistemas" element={<UserEdit/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/index" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
