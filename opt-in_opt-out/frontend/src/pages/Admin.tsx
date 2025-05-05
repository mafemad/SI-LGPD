import { useEffect, useState } from 'react';
import api from '../api/api';
import type { Preference, User, HistoryEntry } from '../types';

export default function Admin() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newPref, setNewPref] = useState({ name: '', description: '' });
  const [newUser, setNewUser] = useState({ name: '', isAdmin: false });
  const [newUserPrefs, setNewUserPrefs] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});

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
    } catch (err) {
      alert('Erro ao criar preferência');
    }
  };

  const handleDeletePreference = async (id: string) => {
    await api.post('/preferences/delete', { id });
    fetchPreferences();
    fetchUsers();
  };

  const handleUpdateUserPrefs = async (userId: string, prefs: Record<string, boolean>) => {
    await api.put(`/preferences/${userId}`, prefs);
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, preferences: prefs } : u))
    );
  };

  const handleGetHistory = async (userId: string) => {
    const res = await api.get(`/history/${userId}`);
    setHistory(prev => ({ ...prev, [userId]: res.data }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Área Administrativa</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Preferências</h2>
        <table className="w-full my-2 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Descrição</th>
              <th className="p-2">Ação</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map(pref => (
              <tr key={pref.id} className="border-t">
                <td className="p-2">{pref.name}</td>
                <td className="p-2">{pref.description}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDeletePreference(pref.id)}
                    className="text-red-600 underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Nome"
            value={newPref.name}
            onChange={e => setNewPref({ ...newPref, name: e.target.value })}
            className="border px-2 py-1 mr-2"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newPref.description}
            onChange={e => setNewPref({ ...newPref, description: e.target.value })}
            className="border px-2 py-1 mr-2"
          />
          <button onClick={handleCreatePreference} className="bg-blue-600 text-white px-3 py-1 rounded">
            Criar
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Usuários</h2>
        {users.map(user => (
          <div key={user.id} className="border rounded p-4 my-2">
            <p>
              <strong>{user.name}</strong> ({user.isAdmin ? 'Admin' : 'Usuário'}){' '}
              <button
                onClick={() => handleGetHistory(user.id)}
                className="ml-4 text-blue-600 underline"
              >
                Ver histórico
              </button>
            </p>
            <div className="mt-2">
              {preferences.map(pref => (
                <label key={pref.name} className="block text-sm mb-1">
                  <input
                    type="checkbox"
                    checked={user.preferences[pref.name] || false}
                    onChange={e => {
                      const updated = {
                        ...user.preferences,
                        [pref.name]: e.target.checked,
                      };
                      handleUpdateUserPrefs(user.id, updated);
                    }}
                  />{' '}
                  <strong>{pref.name}</strong> – {pref.description}
                </label>
              ))}
            </div>
            {history[user.id] && (
              <div className="mt-3 bg-gray-100 p-2 rounded">
                <p className="font-semibold">Histórico:</p>
                <ul className="text-sm list-disc pl-4">
                  {history[user.id].map(h => (
                    <li key={h.id}>
                      [{new Date(h.timestamp).toLocaleString()}] {h.action}{' '}
                      <strong>{h.preference?.name || 'Preferência removida'}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
