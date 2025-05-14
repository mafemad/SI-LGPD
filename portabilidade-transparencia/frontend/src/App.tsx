// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {UserDashboard} from "./pages/UserDashboard";
import { UserEdit } from "./pages/UserEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/editar-usuario" element={<UserEdit/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
