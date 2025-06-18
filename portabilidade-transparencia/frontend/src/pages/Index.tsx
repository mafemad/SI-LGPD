import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const [user, setUser] = useState<any>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
const parsed = JSON.parse(data);
setUser({
  ...parsed,
  shareData: parsed.shareData ?? true 
});

    } else {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEdit = () => {
    navigate("/sistemas");
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '60px', color: '#333' }}>
          Bem-vindo, {user.name}
        </h2>

        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <p><strong>CPF:</strong> {user.cpf}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Endereço:</strong> {user.address}</p>
          <p><strong>Idade:</strong> {user.age}</p>
          <p>
            <strong>Portabilidade:</strong>{" "}
            {user.shareData ? "Ativada" : "Desativada"}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {[{ text: 'Sistemas Conectados', action: handleEdit }, { text: 'Logout', action: handleLogout }]
            .map(({ text, action }, index) => (
              <button
                key={index}
                onClick={action}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#303f9f'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3f51b5'}
              >
                {text}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
