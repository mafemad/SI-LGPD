import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { HistoryEntry } from '../types';
import { Typography, List, Card, Pagination, Button, Alert, Space } from 'antd';

const { Title, Text } = Typography;

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

  return (
    <Card style={{ maxWidth: 800, margin: '40px auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>
        Histórico de Alterações
      </Title>

      {history.length === 0 ? (
        <Alert
          message="Nenhuma alteração registrada ainda."
          type="info"
          showIcon
          style={{ textAlign: 'center', marginTop: 24 }}
        />
      ) : (
        <>
          <List
            itemLayout="vertical"
            size="small"
            dataSource={paginatedHistory}
            renderItem={(h) => (
              <List.Item key={h.id}>
                <Card type="inner">
                  <div style={{ marginBottom: 4, color: '#888' }}>
                    [{new Date(h.timestamp).toLocaleString()}]
                  </div>
                  <div>
                    Você realizou <Text strong>{h.action === 'opt-in' ? 'opt-in' : 'opt-out'}</Text> em{' '}
                    {h.preference ? (
                      <Text italic style={{ color: '#1677ff' }}>
                        {h.preference.name}
                      </Text>
                    ) : h.preferenceName ? (
                      <Text italic type="danger">
                        {h.preferenceName} (removida)
                      </Text>
                    ) : (
                      <Text italic type="danger">
                        [Preferência removida]
                      </Text>
                    )}
                    {h.consentTerm?.version !== undefined && (
                      <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                        (termo de consentimento versão {h.consentTerm.version})
                      </Text>
                    )}
                  </div>
                  {h.preference?.description && (
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                      {h.preference.description}
                    </Text>
                  )}
                </Card>
              </List.Item>
            )}
          />

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              current={currentPage}
              total={history.length}
              pageSize={ITEMS_PER_PAGE}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Button type="default" onClick={() => navigate('/dashboard')}>
          Voltar
        </Button>
      </div>
    </Card>
  );
};

export default History;
