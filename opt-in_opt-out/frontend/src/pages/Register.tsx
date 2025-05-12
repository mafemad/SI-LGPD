import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Preference, Term } from '../types';

export default function Register() {
  const [name, setName] = useState('');
  const [term, setTerm] = useState<Term | null>(null);
  const [selectedPrefs, setSelectedPrefs] = useState<Record<string, boolean>>({});
  const [accepted, setAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTerm();
  }, []);

  const fetchTerm = async () => {
    const res = await api.get('/terms?active=true');
    const activeTerm = res.data?.[0];
    if (activeTerm) setTerm(activeTerm);
  };

  const handleRegister = async () => {
    if (!name.trim()) return alert('Digite um nome');
    if (!accepted) return alert('Você precisa aceitar os termos para continuar');
    if (!term) return alert('Termo ativo não encontrado');
  
    const preferencesPayload = Object.fromEntries(
      Object.entries(selectedPrefs).filter(([_, checked]) => checked)
    );
  
    // Criação do usuário
    const res = await api.post('/users', {
      name,
      isAdmin: false,
      termId: term.id,
      preferences: preferencesPayload,
    });
  
    const user = res.data;
  
    // Registro do aceite do termo
    await api.post('/terms/accept', {
      userId: user.id,
      termId: term.id,
    });
  
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

        {term && (
          <div className="mb-4">
            <label className="flex items-start gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
              />
              <div className="flex flex-col">
                <span className="font-medium">Aceito o termo de consentimento</span>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-sm text-blue-600 hover:underline text-left p-0 mt-1"
                >
                  Visualizar termo
                </button>
              </div>
            </label>

            {term.preferences?.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Preferências (opcional):</p>
                {term.preferences.map(pref => (
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
            )}
          </div>
        )}

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

      {showModal && term && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">Termo de Consentimento</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 max-h-[300px] overflow-y-auto">
              {term.content}
            </pre>
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
