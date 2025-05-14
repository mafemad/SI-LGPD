import { useEffect, useState } from 'react';
import api from '../api/api';
import type { HistoryEntry } from '../types';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const History = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const paginatedHistory = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Histórico de Alterações</h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma alteração registrada ainda.</p>
      ) : (
        <>
          <ul className="space-y-4 text-sm">
            {paginatedHistory.map((h) => (
              <li key={h.id} className="bg-gray-50 border border-gray-200 p-4 rounded">
                <div className="mb-1 text-gray-600">
                  [{new Date(h.timestamp).toLocaleString()}]
                </div>
                <div>
                  Você realizou <strong>{h.action === 'opt-in' ? 'opt-in' : 'opt-out'}</strong> em{' '}
                  {h.preference ? (
                    <em className="text-blue-600 font-medium">{h.preference.name}</em>
                  ) : h.preferenceName ? (
                    <em className="text-red-500 font-medium italic">
                      {h.preferenceName} (removida)
                    </em>
                  ) : (
                    <em className="text-red-500 font-medium italic">[Preferência removida]</em>
                  )}
                  {h.consentTerm?.version !== undefined && (
                  <span className="text-xs text-gray-500 ml-2">
                    (termo de consentimento versão {h.consentTerm.version})
                  </span>
                  )}
                </div>
                {h.preference?.description && (
                  <p className="text-xs text-gray-500 mt-1 pl-4">{h.preference.description}</p>
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-6 text-sm">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Anterior
            </button>

            <span className="text-gray-700">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Próximo
            </button>
          </div>
        </>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default History;
