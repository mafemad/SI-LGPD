import { useEffect, useState } from 'react';
import api from '../api/api';
import type { Preference, User, HistoryEntry } from '../types';

export default function Admin() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [newPref, setNewPref] = useState({ name: '', description: '' });
  const [newUser, setNewUser] = useState({ name: '', isAdmin: false });
  const [newUserPrefs, setNewUserPrefs] = useState<Record<string, boolean>>({});

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
    await api.post('/preferences/create', newPref);
    setNewPref({ name: '', description: '' });
    fetchPreferences();
  };

  const handleDeletePreference = async (id: string) => {
    await api.post('/preferences/delete', { id });
    fetchPreferences();
    fetchUsers(); // Atualiza porque preferências dos usuários também mudam
  };

  const handleCreateUser = async () => {
    if (!newUser.name.trim()) return alert('Nome é obrigatório');
    await api.post('/users', {
      ...newUser,
      preferences: newUserPrefs,
    });
    setNewUser({ name: '', isAdmin: false });
    setNewUserPrefs({});
    fetchUsers();
  };

  const handleUpdateUserPrefs = async (userId: string, prefs: Record<string, boolean>) => {
    await api.put(`/preferences/${userId}`, prefs);
    fetchUsers();
  };

  const handleGetHistory = async (userId: string) => {
    const res = await api.get(`/history/${userId}`);
    setHistory(prev => ({ ...prev, [userId]: res.data }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Área Administrativa</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Preferências</h2>
        <table className="w-full my-2 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Nome</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">
                  <button onClick={() => handleDeletePreference(p.id)} className="text-red-500">
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Nome"
            value={newPref.name}
            onChange={e => setNewPref(prev => ({ ...prev, name: e.target.value }))}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={newPref.description}
            onChange={e => setNewPref(prev => ({ ...prev, description: e.target.value }))}
            className="border p-2"
          />
          <button onClick={handleCreatePreference} className="bg-blue-500 text-white px-4">
            Criar Preferência
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Criar Usuário</h2>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Nome"
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2"
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={newUser.isAdmin}
              onChange={e => setNewUser({ ...newUser, isAdmin: e.target.checked })}
            />
            Admin
          </label>
        </div>
        <div className="mt-2">
          <p className="font-medium">Preferências:</p>
          {preferences.map(pref => (
            <label key={pref.id} className="mr-4">
              <input
                type="checkbox"
                checked={newUserPrefs[pref.name] || false}
                onChange={e =>
                  setNewUserPrefs(prev => ({
                    ...prev,
                    [pref.name]: e.target.checked,
                  }))
                }
              />{' '}
              {pref.name}
            </label>
          ))}
        </div>
        <button onClick={handleCreateUser} className="mt-2 bg-green-500 text-white px-4">
          Criar Usuário
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Usuários</h2>
        {users.map(user => (
          <div key={user.id} className="border rounded p-4 my-2">
            <p>
              <strong>{user.name}</strong> ({user.isAdmin ? 'Admin' : 'Usuário'})
              <button
                onClick={() => handleGetHistory(user.id)}
                className="ml-4 text-blue-500 underline"
              >
                Ver histórico
              </button>
            </p>
            <div className="mt-2">
              {preferences.map(pref => (
                <label key={pref.name} className="mr-4">
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
                  {pref.name}
                </label>
              ))}
            </div>
            {history[user.id] && (
              <div className="mt-2 text-sm text-gray-700">
                <p className="font-semibold">Histórico:</p>
                <ul>
                  {history[user.id].map(h => (
                    <li key={h.id}>
                      [{new Date(h.timestamp).toLocaleString()}] {h.action} -{' '}
                      {h.preference?.name || 'Preferência removida'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
