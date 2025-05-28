import React, { useEffect, useState } from 'react';

interface User {
  name: string;
  cpf: string;
  email: string;
  address: string;
  age: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(data));
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao decodificar os dados:", error);
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
