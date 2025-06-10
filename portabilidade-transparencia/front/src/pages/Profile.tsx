import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { Card, Typography } from 'antd';

interface User {
  name: string;
  cpf: string;
  email: string;
  address: string;
  age: number;
}

const SECRET_KEY = 'HFXm!7265EHOa130205';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encryptedData = params.get('data');

    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
          throw new Error("Não foi possível descriptografar os dados");
        }

        const parsedUser = JSON.parse(decryptedString);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao descriptografar os dados:", error);
      }
    }
  }, []);

  if (!user) {
    return (
      <div
        style={{
          height: '100vh',
          background: 'linear-gradient(135deg, #e0f2ff, #cce4ff)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial',
        }}
      >
        <Typography.Text style={{ fontSize: 18, color: '#003366' }}>
          Nenhuma informação disponível
        </Typography.Text>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #e0f2ff, #cce4ff)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'Arial',
      }}
    >
      <Card
        title="Informações do Usuário"
        headStyle={{ textAlign: 'center', color: '#003366', fontSize: 22 }}
        style={{
          width: 450,
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          background: '#ffffffee',
        }}
      >
        <Typography.Paragraph>
          <strong>Nome:</strong> {user.name}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>CPF:</strong> {user.cpf}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Email:</strong> {user.email}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Endereço:</strong> {user.address}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>Idade:</strong> {user.age}
        </Typography.Paragraph>
      </Card>
    </div>
  );
};

export default Profile;
