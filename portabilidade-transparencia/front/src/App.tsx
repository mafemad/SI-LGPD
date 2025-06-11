import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PortabilityCallback from './pages/PortabilityCallback';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      {/* Rota pública (sem autenticação, sem layout) */}
      <Route path="/portabilidade" element={<Login />} />
      <Route path="/portability/callback" element={<PortabilityCallback />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
