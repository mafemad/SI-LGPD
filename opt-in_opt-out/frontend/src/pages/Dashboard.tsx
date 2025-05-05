import { useEffect, useState } from 'react';
import type { PreferenceMap, User } from '../types/index';
import api from '../api/api';
import PreferenceItem from '../components/PreferenceItem';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
        Bem-vindo, {user?.name}
      </h2>

      {Object.entries(preferences).map(([name, optedIn]) => (
        <PreferenceItem
          key={name}
          name={name}
          optedIn={optedIn}
          onChange={(value) => handleChange(name, value)}
        />
      ))}

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          style={{
            backgroundColor: hasChanges ? '#4caf50' : '#ccc',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            marginRight: '1rem',
            cursor: hasChanges ? 'pointer' : 'not-allowed',
          }}
        >
          Salvar Alterações
        </button>
        <button onClick={() => navigate('/history')}>Ver Histórico</button>
        {user?.isAdmin && (
          <button onClick={() => navigate('/admin')} style={{ marginLeft: '1rem' }}>
            Ir para Admin
          </button>
        )}
      </div>

      {hasChanges && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          Você fez alterações. Não esqueça de salvar!
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleLogout} style={{ backgroundColor: '#f44336', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Modal de notificações */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Notificações</h3>
            {notifications.filter(n => !n.read).map(n => (
              <div key={n.id} style={{ marginBottom: '0.75rem' }}>
                <p style={{ margin: 0 }}>{n.message}</p>
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{
                    color: 'blue',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '0.25rem'
                  }}
                >
                  Marcar como lida
                </button>
              </div>
            ))}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setShowModal(false)}>Fechar</button>
              <button onClick={markAllAsRead} style={{ fontWeight: 'bold' }}>
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
