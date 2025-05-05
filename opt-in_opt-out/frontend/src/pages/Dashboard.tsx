import { useEffect, useState } from 'react';
import type { PreferenceMap, User } from '../types/index';
import api from '../api/api';
import PreferenceItem from '../components/PreferenceItem';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
  const [hasChanges, setHasChanges] = useState<boolean>(false); // Monitorar alterações
  const [notifications, setNotifications] = useState<any[]>([]); // Armazenar notificações
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setPreferences(parsed.preferences || {}); // Garante que as preferências sejam definidas corretamente

    // Buscar notificações ao carregar o dashboard
    if (parsed.id) {
      fetchNotifications(parsed.id);
    }
  }, []);

  // Função para buscar notificações
  const fetchNotifications = async (userId: string) => {
    try {
      const res = await api.get(`/notifications/${userId}`);
      setNotifications(res.data); // Carregar notificações completas
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    }
  };

  // Marcar notificação como lida
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.post(`/notifications/read/${notificationId}`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida', error);
    }
  };

  const handleChange = (key: string, value: boolean) => {
    setPreferences((prev) => {
      const updatedPreferences = { ...prev, [key]: value };
      setHasChanges(JSON.stringify(updatedPreferences) !== JSON.stringify(preferences)); // Verifica se houve mudança
      return updatedPreferences;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    const updates = preferences;
    try {
      await api.put(`/preferences/${user.id}`, updates);
      alert('Preferências salvas!');
      setHasChanges(false); // Reseta o estado de mudanças após salvar
    } catch (error) {
      alert('Erro ao salvar as preferências.');
    }
  };

  return (
    <div>
      <h2>Bem-vindo, {user?.name}</h2>

      {/* Exibição das notificações */}
      <div className="mb-4">
        {notifications.length > 0 && (
          <div className="p-2 bg-green-200 text-green-800 rounded">
            {/* Filtra as notificações não lidas */}
            {notifications
              .filter(notification => !notification.read) // Exibe apenas notificações não lidas
              .map((notification) => (
                <div key={notification.id} className="flex justify-between items-center">
                  <p className={notification.read ? 'line-through' : ''}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="ml-2 text-blue-600"
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Exibição das preferências */}
      {Object.entries(preferences).map(([name, optedIn]) => (
        <PreferenceItem
          key={name}
          name={name}
          optedIn={optedIn}
          onChange={(value) => handleChange(name, value)}
        />
      ))}
      
      <button onClick={handleSave} disabled={!hasChanges}>
        Salvar Alterações
      </button>
      <button onClick={() => navigate('/history')}>Ver Histórico</button>
      {user?.isAdmin && <button onClick={() => navigate('/admin')}>Ir para Admin</button>}

      {/* Notificação de mudanças */}
      {hasChanges && <div className="text-red-600 mt-2">Você fez alterações. Não esqueça de salvar!</div>}
    </div>
  );
};

export default Dashboard;
