import { useEffect, useState } from 'react';
import type { PreferenceMap, User } from '../types/index';
import api from '../api/api';
import PreferenceItem from '../components/PreferenceItem';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setPreferences(parsed.preferences);
  }, []);

  const handleChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    const updates = preferences;
    await api.put(`/preferences/${user.id}`, updates);
    alert('Preferências salvas!');
  };

  return (
    <div>
      <h2>Bem-vindo, {user?.name}</h2>
      {Object.entries(preferences).map(([name, optedIn]) => (
        <PreferenceItem
          key={name}
          name={name}
          optedIn={optedIn}
          onChange={(value) => handleChange(name, value)}
        />
      ))}
      <button onClick={handleSave}>Salvar Alterações</button>
      <button onClick={() => navigate('/history')}>Ver Histórico</button>
      {user?.isAdmin && <button onClick={() => navigate('/admin')}>Ir para Admin</button>}
    </div>
  );
};

export default Dashboard;
