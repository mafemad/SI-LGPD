// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {UserDashboard} from "./pages/UserDashboard";
import { UserEdit } from "./pages/UserEdit";
import CallbackPage from "./pages/CallbackPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/editar-usuario" element={<UserEdit/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portability/callback" element={<CallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
