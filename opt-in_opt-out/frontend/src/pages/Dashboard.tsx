import { useEffect, useState } from 'react';
import type { PreferenceMap, User, Preference } from '../types/index';
import api from '../api/api';
import PreferenceItem from '../components/PreferenceItem';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
  const [allPreferences, setAllPreferences] = useState<Preference[]>([]); // Para armazenar as preferências completas (com nome e descrição)
  const [hasChanges, setHasChanges] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
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
    }
    fetchPreferences(); // Carregar as preferências completas (nome e descrição)
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await api.get(`/notifications/${userId}`);
      setNotifications(res.data);
      const hasUnread = res.data.some((n: any) => !n.read);
      setShowModal(hasUnread);
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    }
  };

  // Função para buscar todas as preferências com nome e descrição
  const fetchPreferences = async () => {
    try {
      const res = await api.get('/preferences');
      setAllPreferences(res.data); // Armazenar preferências completas
    } catch (error) {
      console.error('Erro ao buscar preferências', error);
    }
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
    setShowModal(false);
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

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Bem-vindo, {user?.name}</h2>
      <p className="text-gray-600 mb-6">Gerencie abaixo suas preferências de comunicação.</p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Preferências de Comunicação</h3>
        {allPreferences.map((pref) => (
          <div key={pref.id} className="mb-4">
            <PreferenceItem
              name={pref.name}
              optedIn={preferences[pref.name] || false}
              onChange={(value) => handleChange(pref.name, value)}
            />
            {/* Exibe a descrição da preferência */}
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

      {/* Modal de notificações */}
      {showModal && (
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
                onClick={() => setShowModal(false)}
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
