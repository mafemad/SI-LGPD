import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

export default function Login() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name.trim()) return alert('Digite um nome');

    try {
      const res = await api.post('/auth/login', { name });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      alert('Usuário não encontrado');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        className="border p-2 w-64"
        type="text"
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleLogin}
      >
        Entrar
      </button>
      <p className="mt-2">
        Não tem conta?{' '}
        <Link to="/register" className="text-blue-600 underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
