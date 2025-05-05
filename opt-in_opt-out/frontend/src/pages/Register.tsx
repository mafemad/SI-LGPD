import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Preference } from '../types';

export default function Register() {
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
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
      isAdmin,
      preferences: selectedPrefs,
    });

    const user = res.data;
    localStorage.setItem('user', JSON.stringify(user));
    navigate(user.isAdmin ? '/admin' : '/user');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Cadastro de Usuário</h1>
      <input
        className="border p-2 w-64"
        type="text"
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label className="flex items-center gap-2">
      </label>

      <div className="w-64">
        <p className="font-medium">Preferências:</p>
        {preferences.map(pref => (
          <label key={pref.id} className="block text-sm">
            <input
              type="checkbox"
              checked={selectedPrefs[pref.name] || false}
              onChange={e =>
                setSelectedPrefs(prev => ({
                  ...prev,
                  [pref.name]: e.target.checked,
                }))
              }
            />{' '}
            {pref.name}
          </label>
        ))}
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleRegister}
      >
        Criar Conta
      </button>
      <p className="mt-2">
        Já tem uma conta?{' '}
        <a href="/" className="text-blue-600">Faça login</a>
      </p>
    </div>
  );
}
