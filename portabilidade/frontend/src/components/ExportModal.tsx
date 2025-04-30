import React, { useState } from 'react';

interface ExportModalProps {
  userId: number;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ userId, onClose }) => {
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [method, setMethod] = useState<'download' | 'email'>('download');
  const [message, setMessage] = useState('');

  const exportData = async () => {
    try {
      if (method === 'download') {
        const res = await fetch(`http://localhost:3000/export/${userId}?format=${format}`);
        if (!res.ok) throw new Error('Erro no download');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `dados.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const res = await fetch(`http://localhost:3000/export/send-email/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ format }),
        });
        if (!res.ok) throw new Error('Erro ao enviar e-mail');
        setMessage('Exportação enviada por e-mail!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Erro ao exportar dados.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Exportar Dados</h2>

        <label>Formato:</label>
        <select value={format} onChange={e => setFormat(e.target.value as any)}>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>

        <label>Método:</label>
        <select value={method} onChange={e => setMethod(e.target.value as any)}>
          <option value="download">Download</option>
          <option value="email">E-mail</option>
        </select>

        <button onClick={exportData}>Exportar</button>
        <button onClick={onClose}>Fechar</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};
