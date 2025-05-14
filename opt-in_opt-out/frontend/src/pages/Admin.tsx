import { useEffect, useState } from 'react';
import api from '../api/api';
import type { Preference, User, HistoryEntry } from '../types';
import { useNavigate } from 'react-router-dom';

interface Term {
  id: string;
  version: number;
  content: string;
  active: boolean;
  createdAt: string;
  preferences: Preference[];
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({});

  const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [newPrefs, setNewPrefs] = useState<{ name: string; description: string }[]>([]);
  const [newPrefInput, setNewPrefInput] = useState({ name: '', description: '' });
  const [termContent, setTermContent] = useState('');
  const [terms, setTerms] = useState<Term[]>([]);
  const [showInactiveTerms, setShowInactiveTerms] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchPreferences();
    fetchTerms();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const fetchPreferences = async () => {
    const res = await api.get('/preferences');
    setAllPreferences(res.data);
  };

  const fetchTerms = async () => {
    const res = await api.get('/terms');
    setTerms(res.data);
  };

  const handleToggleHistory = async (userId: string) => {
    const isOpen = openHistory[userId];
    if (isOpen) {
      setOpenHistory(prev => ({ ...prev, [userId]: false }));
    } else {
      if (!history[userId]) {
        const res = await api.get(`/history/${userId}`);
        setHistory(prev => ({ ...prev, [userId]: res.data }));
      }
      setOpenHistory(prev => ({ ...prev, [userId]: true }));
    }
  };

  const handleCreateTerm = async () => {
    if (!termContent.trim()) return alert('O conteúdo do termo é obrigatório.');
    try {
      await api.post('/terms', {
        content: termContent,
        preferenceIds: selectedPrefs,
        newPreferences: newPrefs,
      });
      setTermContent('');
      setSelectedPrefs([]);
      setNewPrefs([]);
      setNewPrefInput({ name: '', description: '' });
      fetchTerms();
    } catch {
      alert('Erro ao criar termo.');
    }
  };

  const handleAddNewPref = () => {
    if (!newPrefInput.name.trim()) return;
    setNewPrefs([...newPrefs, newPrefInput]);
    setNewPrefInput({ name: '', description: '' });
  };

  const activeTerm = terms.find(t => t.active);
  const inactiveTerms = terms.filter(t => !t.active);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Novo Termo de Consentimento</h2>
        <textarea
          className="w-full border rounded p-3 mb-4"
          rows={4}
          placeholder="Conteúdo do termo"
          value={termContent}
          onChange={e => setTermContent(e.target.value)}
        />

        <div className="mb-4">
          <p className="font-semibold mb-1">Selecionar Preferências Existentes:</p>
          <div className="flex flex-wrap gap-2">
            {allPreferences.map(p => (
              <label key={p.id} className="flex items-center space-x-1 text-sm">
                <input
                  type="checkbox"
                  checked={selectedPrefs.includes(p.id)}
                  onChange={() =>
                    setSelectedPrefs(prev =>
                      prev.includes(p.id)
                        ? prev.filter(id => id !== p.id)
                        : [...prev, p.id]
                    )
                  }
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-1">Adicionar Novas Preferências:</p>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nome"
              value={newPrefInput.name}
              onChange={e => setNewPrefInput({ ...newPrefInput, name: e.target.value })}
              className="border px-3 py-2 rounded w-48"
            />
            <input
              type="text"
              placeholder="Descrição"
              value={newPrefInput.description}
              onChange={e => setNewPrefInput({ ...newPrefInput, description: e.target.value })}
              className="border px-3 py-2 rounded flex-1"
            />
            <button
              onClick={handleAddNewPref}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>
          {newPrefs.length > 0 && (
            <ul className="text-sm list-disc ml-6">
              {newPrefs.map((p, i) => (
                <li key={i}>
                  <strong>{p.name}</strong>{p.description ? ` – ${p.description}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleCreateTerm}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Criar Termo
        </button>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">Termo Ativo</h2>
          <button
            onClick={() => setShowInactiveTerms(prev => !prev)}
            className="text-blue-600 underline"
          >
            {showInactiveTerms ? 'Ocultar Inativos' : 'Mostrar Inativos'}
          </button>
        </div>

        {activeTerm ? (
          <div className="bg-gray-100 p-4 rounded shadow-sm mb-4">
            <p className="font-semibold">Versão {activeTerm.version}</p>
            <p className="whitespace-pre-line text-sm mt-2">{activeTerm.content}</p>
            <p className="mt-2 text-sm text-gray-500">Criado em: {new Date(activeTerm.createdAt).toLocaleString()}</p>
            {activeTerm.preferences?.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold">Preferências associadas:</p>
                <ul className="list-disc pl-5 text-sm">
                  {activeTerm.preferences.map(pref => (
                    <li key={pref.id}>
                      <strong>{pref.name}</strong>{' '}
                      {pref.description ? `– ${pref.description}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
        ) : (
          <p className="text-gray-500">Nenhum termo ativo.</p>
        )}

        {showInactiveTerms && inactiveTerms.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-medium mb-2">Termos Inativos</h3>
            {inactiveTerms.map(term => (
            <div key={term.id} className="border rounded p-4 mb-3 bg-white shadow-sm">
              <p className="font-semibold">Versão {term.version}</p>
              <p className="whitespace-pre-line text-sm mt-2">{term.content}</p>
              <p className="mt-2 text-sm text-gray-500">Criado em: {new Date(term.createdAt).toLocaleString()}</p>

              {term.preferences?.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold">Preferências associadas:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {term.preferences.map(pref => (
                      <li key={pref.id}>
                        <strong>{pref.name}</strong>{' '}
                        {pref.description ? `– ${pref.description}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Usuários</h2>
        <p className="text-gray-600 mb-4">Visualize as preferências e o histórico de alterações de cada usuário.</p>

        {users.map(user => (
          <div key={user.id} className="border rounded p-5 mb-6 bg-gray-50 shadow-sm">
            <p className="font-semibold text-lg">
              {user.name}{' '}
              <span className="text-sm text-gray-600">
                ({user.isAdmin ? 'Admin' : 'Usuário'})
              </span>
              <button
                onClick={() => handleToggleHistory(user.id)}
                className="ml-4 text-blue-600 underline text-sm"
              >
                {openHistory[user.id] ? 'Fechar histórico' : 'Ver histórico'}
              </button>
            </p>

            <div className="mt-2">
              <p className="font-semibold">Preferências Ativas:</p>
              {Object.entries(user.preferences)
                .filter(([_, isActive]) => isActive)
                .map(([prefKey]) => {
                  const pref = allPreferences.find(p => p.name === prefKey);
                  return (
                    <div key={prefKey} className="text-sm pl-2 mb-1">
                      ✅ <strong>{pref?.name || prefKey}</strong>{' '}
                      {pref?.description ? `– ${pref.description}` : ''}
                    </div>
                  );
                })}
            </div>

            {openHistory[user.id] && history[user.id] && (
              <div className="mt-4 bg-white border border-gray-200 p-4 rounded">
                <p className="font-semibold mb-2">Histórico de Alterações:</p>
                {history[user.id].length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma alteração registrada ainda.</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {history[user.id].map(h => (
                      <li key={h.id}>
                        <span className="text-gray-600">
                          [{new Date(h.timestamp).toLocaleString()}]
                        </span>{' '}
                        {h.action === 'opt-in' ? 'Opt-in em' : 'Opt-out de'}{' '}
                        {h.preference ? (
                          <em className="text-blue-600 font-medium">{h.preference.name}</em>
                        ) : h.preferenceName ? (
                          <em className="text-red-500 font-medium italic">
                            {h.preferenceName} (removida)
                          </em>
                        ) : (
                          <em className="text-red-500 font-medium italic">[Preferência removida]</em>
                        )}
                        {h.consentTerm?.version !== undefined && (
                          <span className="text-xs text-gray-500 ml-2">(termo de consentimento versão {h.consentTerm.version})</span>
                        )}
                        {h.preference?.description && (
                          <p className="text-xs text-gray-500 pl-4">{h.preference.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
