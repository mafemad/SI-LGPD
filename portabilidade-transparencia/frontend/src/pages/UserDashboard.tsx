import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'minha-chave-secreta'; // troque por uma chave segura

const spinnerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '6px solid #ccc',
  borderTopColor: '#3f51b5',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '20px',
};

export const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (!data) {
      navigate('/');
      return;
    }

    const parsedUser = JSON.parse(data);
    setUser(parsedUser);

    // Após 3 segundos, troca loading para false (mostra mensagem)
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Criptografa e codifica os dados para envio
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(parsedUser), SECRET_KEY).toString();
    const encodedData = encodeURIComponent(encryptedData);

    // Redireciona após 5 segundos
    const redirectTimer = setTimeout(() => {
      window.location.href = `http://localhost:5173/profile?data=${encodedData}`;
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  if (!user) return <div>Carregando...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {loading ? (
        <>
          <div style={spinnerStyle}></div>
          <h2 style={{ color: '#333' }}>Estamos redirecionando para o Sistema I...</h2>
        </>
      ) : (
        <h2 style={{ color: '#333' }}>Estamos redirecionando para o Sistema I...</h2>
      )}
    </div>
  );
};
