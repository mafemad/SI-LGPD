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

    try {
        const response = await fetch(`http://localhost:3000/users/${user.id}`, {

        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro na atualização');
      }

      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Usuário atualizado com sucesso!');
      navigate('/user'); // ou para a rota desejada

    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Falha ao atualizar usuário.');
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="edit-user">
      <h2>Editar Informações do Usuário</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>CPF:</label>
        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Endereço:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />

        <label>Idade:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};
