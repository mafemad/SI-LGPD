import { useEffect, useState } from 'react';
import api from '../api/api';
import type { HistoryEntry } from '../types';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }

    const parsed = JSON.parse(userData);
    api.get(`/history/${parsed.id}`).then((res) => setHistory(res.data));
  }, []);

  return (
    <div>
      <h2>Histórico de Alterações</h2>
      <ul>
        {history.map((entry) => (
          <li key={entry.id}>
            [{new Date(entry.timestamp).toLocaleString()}] Você realizou <strong>{entry.action}</strong> na preferência <em>{entry.preference.name}</em>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/dashboard')}>Voltar</button>
    </div>
  );
};

export default History;
