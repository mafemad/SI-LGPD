import React, { useEffect, useState } from 'react';
import api from '../api/api';

interface PreferenceFormProps {
  userId: string;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ userId }) => {
  const [preferences, setPreferences] = useState<any[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await api.get('/preferences');
      setPreferences(res.data);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const initial = res.data.reduce((acc: any, pref: any) => {
        acc[pref.id] = user.preferences?.[pref.id] || false;
        return acc;
      }, {});
      setSelectedPreferences(initial);
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
    }
  };

  const handleChange = (id: string, value: boolean) => {
    setSelectedPreferences((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/preferences/${userId}`, {
        preferences: selectedPreferences,
      });

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.preferences = selectedPreferences;
      localStorage.setItem('user', JSON.stringify(user));

      alert('Preferências atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      alert('Erro ao atualizar preferências');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md max-w-md">
      <h2 className="text-lg font-semibold mb-4">Atualizar Preferências</h2>
      {preferences.map((pref) => (
        <div key={pref.id} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={`pref-${pref.id}`}
            checked={selectedPreferences[pref.id] || false}
            onChange={(e) => handleChange(pref.id, e.target.checked)}
            className="mr-2"
          />
          <label htmlFor={`pref-${pref.id}`}>{pref.name}</label>
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
      >
        {loading ? 'Salvando...' : 'Salvar Preferências'}
      </button>
    </form>
  );
};

export default PreferenceForm;
