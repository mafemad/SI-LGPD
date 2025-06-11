import { useEffect, useState } from 'react';
import type { PreferenceMap, User, Preference, ConsentTerm } from '../types/index';
import api from '../api/api';
import PreferenceItem from '../components/PreferenceItem';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Modal,
  Checkbox,
  Alert,
  Divider,
  Space,
  message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
  const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
  const [term, setTerm] = useState<ConsentTerm | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showFullTerm, setShowFullTerm] = useState(false);
  const [accepted, setAccepted] = useState(false);
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
    fetchNotifications(parsed.id);
    fetchActiveTerm(parsed.id);
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await api.get(`/notifications/${userId}`);
      const newNotifications = res.data;
      setNotifications(newNotifications);

      const hasNewTerm = newNotifications.some((n: any) => n.type === 'new_term' && !n.read);
      if (hasNewTerm) setShowTermModal(true);
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    }
  };

  const fetchActiveTerm = async (userId: string) => {
    try {
      const [termsRes, userRes] = await Promise.all([
        api.get('/terms?active=true'),
        api.get(`/users`),
      ]);

      const currentUser = userRes.data.find((u: any) => u.id === userId);
      const latestTerm: ConsentTerm = termsRes.data[0];

      if (currentUser.acceptedTermId !== latestTerm.id) {
        setTerm(latestTerm);
      } else {
        setPreferences(currentUser.preferences || {});
      }

      setAllPreferences(latestTerm.preferences || []);
    } catch (error) {
      console.error('Erro ao buscar termo ativo ou usuário', error);
    }
  };

  const handleChange = (key: string, value: boolean) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      setHasChanges(true);
      return updated;
    });
  };

  const handleAcceptTerm = async () => {
    if (!user || !term) return;

    const preferencesMap: PreferenceMap = {};
    allPreferences.forEach((pref: Preference) => {
      preferencesMap[pref.name] = preferences[pref.name] ?? false;
    });

    try {
      await api.post('/terms/accept', {
        userId: user.id,
        termId: term.id,
        preferencesMap,
      });

      await api.put(`/preferences/${user.id}`, preferences);
      await markTermNotificationAsRead();

      message.success('Termo aceito e preferências salvas com sucesso!');
      setShowTermModal(false);
      setHasChanges(false);
      setAccepted(false);

      const updatedUser = { ...user, acceptedTermId: term.id, preferences };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      message.error('Erro ao aceitar termo ou salvar preferências.');
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      await api.put(`/preferences/${user.id}`, preferences);
      message.success('Preferências salvas com sucesso!');
      setHasChanges(false);

      const updatedUser = { ...user, preferences };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      message.error('Erro ao salvar preferências.');
    }
  };

  const markTermNotificationAsRead = async () => {
    const termNotif = notifications.find(n => n.type === 'new_term' && !n.read);
    if (termNotif) {
      try {
        await api.post(`/notifications/read/${termNotif.id}`);
        setNotifications(prev =>
          prev.map(n => (n.id === termNotif.id ? { ...n, read: true } : n))
        );
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Title level={2}>Bem-vindo, {user?.name}</Title>
      <Paragraph type="secondary">Gerencie abaixo suas preferências de comunicação.</Paragraph>

      <Divider orientation="left">Preferências de Comunicação</Divider>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {allPreferences.map(pref => (
          <div key={pref.id}>
            <PreferenceItem
              name={pref.name}
              optedIn={preferences[pref.name] ?? false}
              onChange={value => handleChange(pref.name, value)}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{pref.description}</Text>
          </div>
        ))}
        {hasChanges && <Alert type="warning" message="Você fez alterações. Não esqueça de salvar!" />}
      </Space>

      <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <Button
          type="primary"
          onClick={handleSavePreferences}
          disabled={!hasChanges}
        >
          Salvar Preferências
        </Button>
        <Button onClick={() => navigate('/history')}>Ver Histórico</Button>
      </div>

      <Divider orientation="left">Sessão</Divider>
      <Button danger onClick={handleLogout}>
        Logout
      </Button>

      <Modal
        open={showTermModal}
        title="Novo Termo de Consentimento"
        onCancel={() => setShowTermModal(false)}
        footer={[
          <Button key="logout" danger onClick={handleLogout}>
            Logout
          </Button>,
          <Button
            key="accept"
            type="primary"
            onClick={handleAcceptTerm}
            disabled={!accepted}
          >
            Aceitar Termo
          </Button>,
        ]}
      >
        {term && (
          <>
            <Button
              type="link"
              onClick={() => setShowFullTerm(true)}
              style={{ padding: 0 }}
            >
              Ver termo completo
            </Button>

            <Divider orientation="left" style={{ marginTop: 16 }}>
              Preferências
            </Divider>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {term.preferences.map(pref => (
                <div key={pref.id}>
                  <PreferenceItem
                    name={pref.name}
                    optedIn={preferences[pref.name] || false}
                    onChange={value => handleChange(pref.name, value)}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>{pref.description}</Text>
                </div>
              ))}
            </Space>

            <Checkbox
              style={{ marginTop: 24 }}
              checked={accepted}
              onChange={e => setAccepted(e.target.checked)}
            >
              Eu li e aceito os termos de consentimento apresentados acima.
            </Checkbox>
          </>
        )}
      </Modal>

      <Modal
        open={showFullTerm}
        title="Conteúdo do Termo"
        onCancel={() => setShowFullTerm(false)}
        footer={[
          <Button key="close" onClick={() => setShowFullTerm(false)}>
            Fechar
          </Button>,
        ]}
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
          {term?.content}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
