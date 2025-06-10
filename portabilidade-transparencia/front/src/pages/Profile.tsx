import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

interface User {
  name: string;
  cpf: string;
  email: string;
  address: string;
  age: number;
}

const SECRET_KEY = 'minha-chave-secreta'; // mesma chave usada para criptografia

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encryptedData = params.get('data');

    if (encryptedData) {
      try {
        // Descriptografa os dados
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

  if (!user) return <div>Nenhuma informação disponível</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Informações do Usuário</h1>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>CPF:</strong> {user.cpf}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Endereço:</strong> {user.address}</p>
      <p><strong>Idade:</strong> {user.age}</p>
    </div>
  );
};

export default Profile;
