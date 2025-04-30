import React, { useEffect, useState } from 'react';
import { ExportModal } from '../components/ExportModal';
import { useNavigate } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }else {
      navigate('/');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="dashboard">
      <h2>Bem-vindo, {user.name}</h2>
      <p><strong>CPF:</strong> {user.cpf}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Endereço:</strong> {user.address}</p>
      <p><strong>Idade:</strong> {user.age}</p>

      <button onClick={() => setShowModal(true)}>Exportar Dados</button>
      <button onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</button>

      {showModal && (
        <ExportModal userId={user.id} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
