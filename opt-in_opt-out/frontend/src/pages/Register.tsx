import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Preference } from '../types';

export default function Register() {
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const res = await api.get('/preferences');
    setPreferences(res.data);
  };

  const handleRegister = async () => {
    if (!name.trim()) return alert('Digite um nome');

    const res = await api.post('/users', {
      name,
      isAdmin: false,
      preferences: selectedPrefs,
    });

    const user = res.data;
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Cadastro de Usuário</h1>

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mb-4">
          <p className="font-medium mb-2">Preferências:</p>
          {preferences.map(pref => (
            <label key={pref.id} className="flex items-start gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={selectedPrefs[pref.name] || false}
                onChange={e =>
                  setSelectedPrefs(prev => ({
                    ...prev,
                    [pref.name]: e.target.checked,
                  }))
                }
              />
              <div>
                <span className="font-medium">{pref.name}</span>
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Criar Conta
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Já tem uma conta?{' '}
          <a href="/" className="text-blue-600 hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
