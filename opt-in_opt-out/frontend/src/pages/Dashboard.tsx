import { useEffect, useState } from 'react';
import type { PreferenceMap, User, Preference, ConsentTerm } from '../types/index';
import api from '../api/api';
import PreferenceItem from '../components/PreferenceItem';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
  const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
  const [term, setTerm] = useState<ConsentTerm | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showFullTerm, setShowFullTerm] = useState(false);
  const [accepted, setAccepted] = useState(false); // <-- novo estado para o checkbox
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

      alert('Termo aceito e preferências salvas com sucesso!');
      setShowTermModal(false);
      setHasChanges(false);
      setAccepted(false);

      const updatedUser = { ...user, acceptedTermId: term.id, preferences };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      alert('Erro ao aceitar termo ou salvar preferências.');
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      await api.put(`/preferences/${user.id}`, preferences);
      alert('Preferências salvas com sucesso!');
      setHasChanges(false);

      const updatedUser = { ...user, preferences };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      alert('Erro ao salvar preferências.');
      console.error(error);
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
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Bem-vindo, {user?.name}</h2>
      <p className="text-gray-600 mb-6">Gerencie abaixo suas preferências de comunicação.</p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Preferências de Comunicação</h3>
        {allPreferences.map((pref) => (
          <div key={pref.id} className="mb-4">
            <PreferenceItem
              name={pref.name}
              optedIn={preferences[pref.name] ?? false}
              onChange={(value) => handleChange(pref.name, value)}
            />
            <p className="text-sm text-gray-600">{pref.description}</p>
          </div>
        ))}
        {hasChanges && (
          <p className="text-red-600 mt-4">
            Você fez alterações. Não esqueça de salvar!
          </p>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={handleSavePreferences}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded text-white transition ${
            hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Salvar Preferências
        </button>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Ver Histórico
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Sessão</h3>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {showTermModal && term && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Novo Termo de Consentimento</h3>

            <button
              onClick={() => setShowFullTerm(true)}
              className="text-blue-600 underline mb-4"
            >
              Ver termo completo
            </button>

            <h4 className="font-semibold mt-4">Escolha suas preferências:</h4>
            {term.preferences.map((pref) => (
              <div key={pref.id} className="mb-2">
                <PreferenceItem
                  name={pref.name}
                  optedIn={preferences[pref.name] || false}
                  onChange={(value) => handleChange(pref.name, value)}
                />
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
            ))}

            <div className="mt-6">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span className="text-sm">
                  Eu li e aceito os termos de consentimento apresentados acima.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleAcceptTerm}
                disabled={!accepted}
                className={`px-4 py-2 rounded text-white transition ${
                  accepted ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Aceitar Termo
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showFullTerm && term && (
        <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Conteúdo do Termo</h3>
            <div className="prose mb-4 whitespace-pre-wrap">{term.content}</div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowFullTerm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
