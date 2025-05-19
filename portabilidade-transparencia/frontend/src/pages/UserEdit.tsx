import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserEdit: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    address: '',
    age: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const parsedUser = JSON.parse(data);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        cpf: parsedUser.cpf || '',
        email: parsedUser.email || '',
        address: parsedUser.address || '',
        age: parsedUser.age || ''
      });
    } else {
      navigate('/');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  const token = localStorage.getItem('token'); 

  if (!token) {
    alert('Token não encontrado. Faça login novamente.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Erro na atualização');
    }

    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Usuário atualizado com sucesso!');
    navigate('/user');

  } catch (error) {
    console.error('Erro ao atualizar:', error);
    alert('Falha ao atualizar usuário.');
  }
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
      <h2 style={{ marginBottom: '60px', textAlign: 'center', color: '#333' }}>
        Editar Informações do Usuário
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            
          />
        </div>

        <div>
          <label>CPF:</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
           
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
           
          />
        </div>

        <div>
          <label>Endereço:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
         
          />
        </div>

        <div>
          <label>Idade:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            
          />
        </div>

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
          Salvar Alterações
        </button>
      </form>
    </div>
  </div>
);

};