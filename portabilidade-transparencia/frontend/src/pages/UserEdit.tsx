import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserEdit: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [shareData, setShareData] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const parsedUser = JSON.parse(data);
      setUser(parsedUser);
      setShareData(parsedUser.shareData ?? true); // true como padrão
    } else {
      navigate('/');
    }
  }, []);

  const toggleShare = () => {
    setShareData(prev => !prev);
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  const updatedUser = { ...user, shareData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  alert('Preferência de compartilhamento atualizada!');

  window.location.href = 'http://localhost:5174/index';
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
        maxWidth: '500px'
      }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>
          Compartilhamento de Dados
        </h2>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p style={{ marginBottom: '10px' }}>
            Você autoriza o compartilhamento dos seus dados com o <br />"SISTEMA I"?
          </p>
          <button
            onClick={toggleShare}
            style={{
              padding: '10px 20px',
              backgroundColor: shareData ? '#4caf50' : '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {shareData ? 'Sim' : 'Não'}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            type="submit"
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
            Salvar Preferência
          </button>
        </form>
      </div>
    </div>
  );
};
