import { useEffect, useState } from 'react';
import api from '../api/api';
import type { Preference, User, HistoryEntry } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newPref, setNewPref] = useState({ name: '', description: '' });
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPreferences();
    fetchUsers();
  }, []);

  const fetchPreferences = async () => {
    const res = await api.get('/preferences');
    setPreferences(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const handleCreatePreference = async () => {
    if (!newPref.name.trim()) return alert('Nome é obrigatório');
    try {
      await api.post('/preferences/create', newPref);
      setNewPref({ name: '', description: '' });
      fetchPreferences();
    } catch {
      alert('Erro ao criar preferência');
    }
  };

  const handleDeletePreference = async (id: string) => {
    await api.post('/preferences/delete', { id });
    fetchPreferences();
    fetchUsers();
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded">
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
        <h2 className="text-2xl font-semibold mb-2">Gerenciar Preferências</h2>
        <p className="text-gray-600 mb-4">Adicione ou remova preferências de notificação disponíveis aos usuários.</p>

        <table className="w-full text-left border border-gray-200 mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Nome</th>
              <th className="p-3 border-b">Descrição</th>
              <th className="p-3 border-b text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map(pref => (
              <tr key={pref.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{pref.name}</td>
                <td className="p-3">{pref.description}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeletePreference(pref.id)}
                    className="text-red-600 underline hover:text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Nome"
            value={newPref.name}
            onChange={e => setNewPref({ ...newPref, name: e.target.value })}
            className="border px-3 py-2 rounded w-48"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newPref.description}
            onChange={e => setNewPref({ ...newPref, description: e.target.value })}
            className="border px-3 py-2 rounded flex-1"
          />
          <button
            onClick={handleCreatePreference}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Criar
          </button>
        </div>
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
                  const pref = preferences.find(p => p.name === prefKey);
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
