import { useEffect, useState } from 'react';
import { Button, Checkbox, Collapse, Divider, Form, Input, List, Modal, Typography, Card, Space, Alert } from 'antd';
import api from '../api/api';
import type { Preference, User, HistoryEntry } from '../types';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Term {
  id: string;
  version: number;
  content: string;
  active: boolean;
  createdAt: string;
  preferences: Preference[];
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({});
  const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [newPrefs, setNewPrefs] = useState<{ name: string; description: string }[]>([]);
  const [newPrefInput, setNewPrefInput] = useState({ name: '', description: '' });
  const [termContent, setTermContent] = useState('');
  const [terms, setTerms] = useState<Term[]>([]);
  const [showInactiveTerms, setShowInactiveTerms] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchPreferences();
    fetchTerms();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const fetchPreferences = async () => {
    const res = await api.get('/preferences');
    setAllPreferences(res.data);
  };

  const fetchTerms = async () => {
    const res = await api.get('/terms');
    setTerms(res.data);
  };

  const handleToggleHistory = async (userId: string) => {
    const isOpen = openHistory[userId];
    if (isOpen) {
      setOpenHistory(prev => ({ ...prev, [userId]: false }));
    } else {
      if (!history[userId]) {
        const res = await api.get(`/history/${userId}`);
        setHistory(prev => ({ ...prev, [userId]: res.data }));
      }
      setOpenHistory(prev => ({ ...prev, [userId]: true }));
    }
  };

  const handleCreateTerm = async () => {
    if (!termContent.trim()) {
      Modal.warning({ title: 'Campo obrigatório', content: 'O conteúdo do termo é obrigatório.' });
      return;
    }
    try {
      await api.post('/terms', {
        content: termContent,
        preferenceIds: selectedPrefs,
        newPreferences: newPrefs,
      });
      setTermContent('');
      setSelectedPrefs([]);
      setNewPrefs([]);
      setNewPrefInput({ name: '', description: '' });
      fetchTerms();
    } catch {
      Modal.error({ title: 'Erro', content: 'Erro ao criar termo.' });
    }
  };

  const handleAddNewPref = () => {
    if (!newPrefInput.name.trim()) return;
    setNewPrefs([...newPrefs, newPrefInput]);
    setNewPrefInput({ name: '', description: '' });
  };

  const activeTerm = terms.find(t => t.active);
  const inactiveTerms = terms.filter(t => !t.active);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      <Space className="w-full justify-between mb-6">
        <Title level={2}>Painel Administrativo</Title>
        <Button danger onClick={handleLogout}>Logout</Button>
      </Space>

      <Card title="Novo Termo de Consentimento" className="mb-8">
        <TextArea
          rows={4}
          placeholder="Conteúdo do termo"
          value={termContent}
          onChange={e => setTermContent(e.target.value)}
          className="mb-4"
        />

        <Divider orientation="left">Preferências Existentes</Divider>
        <Checkbox.Group
          value={selectedPrefs}
          onChange={checked => setSelectedPrefs(checked as string[])}
        >
          <Space direction="vertical">
            {allPreferences.map(p => (
              <Checkbox key={p.id} value={p.id}>
                {p.name}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>

        <Divider orientation="left">Adicionar Novas Preferências</Divider>
        <Space className="mb-2" wrap>
          <Input
            placeholder="Nome"
            value={newPrefInput.name}
            onChange={e => setNewPrefInput({ ...newPrefInput, name: e.target.value })}
            style={{ width: 200 }}
          />
          <Input
            placeholder="Descrição"
            value={newPrefInput.description}
            onChange={e => setNewPrefInput({ ...newPrefInput, description: e.target.value })}
            style={{ width: 400 }}
          />
          <Button onClick={handleAddNewPref} type="primary">Adicionar</Button>
        </Space>

        {newPrefs.length > 0 && (
          <List
            size="small"
            header={<Text strong>Novas Preferências</Text>}
            bordered
            dataSource={newPrefs}
            renderItem={p => (
              <List.Item>
                <Text strong>{p.name}</Text>{p.description ? ` – ${p.description}` : ''}
              </List.Item>
            )}
          />
        )}

        <Button type="primary" className="mt-4" onClick={handleCreateTerm}>Criar Termo</Button>
      </Card>

      <Card title="Termo Ativo" extra={
        <Button type="link" onClick={() => setShowInactiveTerms(prev => !prev)}>
          {showInactiveTerms ? 'Ocultar Inativos' : 'Mostrar Inativos'}
        </Button>
      } className="mb-8">
        {activeTerm ? (
          <>
            <Text strong>Versão {activeTerm.version}</Text>
            <p>{activeTerm.content}</p>
            <Text type="secondary">Criado em: {new Date(activeTerm.createdAt).toLocaleString()}</Text>

            {activeTerm.preferences?.length > 0 && (
              <>
                <Divider />
                <Text strong>Preferências associadas:</Text>
                <ul>
                  {activeTerm.preferences.map(pref => (
                    <li key={pref.id}>
                      <Text strong>{pref.name}</Text>{pref.description ? ` – ${pref.description}` : ''}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <Alert message="Nenhum termo ativo." type="info" />
        )}
      </Card>

      {showInactiveTerms && inactiveTerms.length > 0 && (
        <Card title="Termos Inativos" className="mb-8">
          <Collapse accordion>
            {inactiveTerms.map(term => (
              <Panel header={`Versão ${term.version}`} key={term.id}>
                <p>{term.content}</p>
                <Text type="secondary">Criado em: {new Date(term.createdAt).toLocaleString()}</Text>
                {term.preferences?.length > 0 && (
                  <>
                    <Divider />
                    <Text strong>Preferências associadas:</Text>
                    <ul>
                      {term.preferences.map(pref => (
                        <li key={pref.id}>
                          <Text strong>{pref.name}</Text>{pref.description ? ` – ${pref.description}` : ''}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}

      <Card title="Usuários">
        {users.map(user => (
          <Card
            type="inner"
            title={
              <Space>
                <Text strong>{user.name}</Text>
                <Text type="secondary">({user.isAdmin ? 'Admin' : 'Usuário'})</Text>
                <Button type="link" onClick={() => handleToggleHistory(user.id)}>
                  {openHistory[user.id] ? 'Fechar histórico' : 'Ver histórico'}
                </Button>
              </Space>
            }
            key={user.id}
            className="mb-4"
          >
            <Text strong>Preferências Ativas:</Text>
            <ul>
              {Object.entries(user.preferences)
                .filter(([_, isActive]) => isActive)
                .map(([prefKey]) => {
                  const pref = allPreferences.find(p => p.name === prefKey);
                  return (
                    <li key={prefKey}>
                      ✅ <Text strong>{pref?.name || prefKey}</Text>{' '}
                      {pref?.description ? `– ${pref.description}` : ''}
                    </li>
                  );
                })}
            </ul>

            {openHistory[user.id] && history[user.id] && (
              <>
                <Divider />
                <Text strong>Histórico de Alterações:</Text>
                {history[user.id].length === 0 ? (
                  <Alert message="Nenhuma alteração registrada ainda." type="info" />
                ) : (
                  <List
                    size="small"
                    dataSource={history[user.id]}
                    renderItem={h => (
                      <List.Item key={h.id}>
                        <Text type="secondary">[{new Date(h.timestamp).toLocaleString()}]</Text>{' '}
                        {h.action === 'opt-in' ? 'Opt-in em' : 'Opt-out de'}{' '}
                        {h.preference ? (
                          <Text italic type="success">{h.preference.name}</Text>
                        ) : h.preferenceName ? (
                          <Text italic type="danger">{h.preferenceName} (removida)</Text>
                        ) : (
                          <Text italic type="danger">[Preferência removida]</Text>
                        )}
                        {h.consentTerm?.version !== undefined && (
                          <Text type="secondary" style={{ marginLeft: 8 }}>
                            (termo de consentimento versão {h.consentTerm.version})
                          </Text>
                        )}
                        {h.preference?.description && (
                          <div><Text type="secondary">{h.preference.description}</Text></div>
                        )}
                      </List.Item>
                    )}
                  />
                )}
              </>
            )}
          </Card>
        ))}
      </Card>
    </div>
  );
}
