import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Preference, PreferenceMap, User, Term } from '../types';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
  const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [pendingTerm, setPendingTerm] = useState<Term | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState<Record<string, boolean>>({});
  const [showTermModal, setShowTermModal] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }

    const parsed = JSON.parse(userData);
    setUser(parsed);
    setPreferences(parsed.preferences || {});
    if (parsed.id) {
      fetchNotifications(parsed.id);
      checkForNewTerm(parsed.id);
    }
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await api.get('/preferences');
      setAllPreferences(res.data);
    } catch (error) {
      console.error('Erro ao buscar preferências', error);
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await api.get(`/notifications/${userId}`);
      setNotifications(res.data);
      const hasUnread = res.data.some((n: any) => !n.read);
      setShowNotificationModal(hasUnread);
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    }
  };

  const checkForNewTerm = async (userId: string) => {
    try {
      const res = await api.get(`/terms/pending/${userId}`);
      if (res.data) {
        setPendingTerm(res.data);
      }
    } catch (error) {
      console.error('Erro ao verificar novo termo', error);
    }
  };

  const handleChange = (key: string, value: boolean) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(prev));
      return updated;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await api.put(`/preferences/${user.id}`, preferences);
      alert('Preferências salvas!');
      setHasChanges(false);
    } catch (error) {
      alert('Erro ao salvar as preferências.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.post(`/notifications/read/${notificationId}`);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida', error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => handleMarkAsRead(n.id)));
    setShowNotificationModal(false);
  };

  const handleAcceptTerm = async () => {
    if (!user || !pendingTerm) return;
    if (!accepted) return alert('Você precisa aceitar o termo para continuar');

    const preferencesPayload = Object.fromEntries(
      Object.entries(selectedPrefs).filter(([_, checked]) => checked)
    );

    try {
      const res = await api.post(`/terms/accept/${user.id}`, {
        termId: pendingTerm.id,
        preferences: preferencesPayload,
      });

      const updatedUser = res.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPreferences(updatedUser.preferences || {});
      setPendingTerm(null);
      alert('Termo aceito com sucesso!');
    } catch (error) {
      alert('Erro ao aceitar o termo.');
    }
  };

  if (pendingTerm) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Novo Termo de Consentimento</h1>
          <p className="text-sm text-gray-600 mb-4">
            Você precisa aceitar o novo termo antes de continuar usando a plataforma.
          </p>

          <label className="flex items-start gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              className="mt-1"
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
            />
            <div>
              <span className="font-medium">Li e aceito o termo de consentimento</span>
              <button
                type="button"
                onClick={() => setShowTermModal(true)}
                className="text-sm text-blue-600 hover:underline block mt-1"
              >
                Visualizar termo
              </button>
            </div>
          </label>

          {pendingTerm.preferences?.length > 0 && (
            <div className="mb-4">
              <p className="font-medium mb-2">Preferências (opcional):</p>
              {pendingTerm.preferences.map(pref => (
                <label key={pref.id} className="flex items-start gap-2 mb-2">
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

          <button
            onClick={handleAcceptTerm}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Aceitar Termo e Continuar
          </button>
        </div>

        {showTermModal && (
          <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
              <h2 className="text-xl font-bold mb-4">Termo de Consentimento</h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 max-h-[300px] overflow-y-auto">
                {pendingTerm.content}
              </pre>
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
                onClick={() => setShowTermModal(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Bem-vindo, {user?.name}</h2>
      <p className="text-gray-600 mb-6">Gerencie abaixo suas preferências de comunicação.</p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Preferências de Comunicação</h3>
        {allPreferences.map(pref => (
          <div key={pref.id} className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={preferences[pref.name] || false}
                onChange={e => handleChange(pref.name, e.target.checked)}
              />
              <span className="font-medium">{pref.name}</span>
            </label>
            <p className="text-sm text-gray-600">{pref.description}</p>
          </div>
        ))}
        {hasChanges && (
          <p className="text-red-600 mt-4">Você fez alterações. Não esqueça de salvar!</p>
        )}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded text-white transition ${
              hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Salvar Alterações
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Ver Histórico
          </button>
        </div>
      </section>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Sessão</h3>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {showNotificationModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Notificações</h3>
            {notifications.filter(n => !n.read).length > 0 ? (
              notifications.filter(n => !n.read).map(n => (
                <div key={n.id} className="mb-3">
                  <p>{n.message}</p>
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="text-blue-600 underline text-sm"
                  >
                    Marcar como lida
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma nova notificação.</p>
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-gray-700 underline"
              >
                Fechar
              </button>
              <button
                onClick={markAllAsRead}
                className="font-semibold text-blue-600 underline"
              >
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
