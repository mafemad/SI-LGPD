import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Preference, Term } from '../types';
import {
  Card,
  Typography,
  Input,
  Checkbox,
  Button,
  Modal,
  Form,
  message,
} from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

export default function Register() {
  const [name, setName] = useState('');
  const [term, setTerm] = useState<Term | null>(null);
  const [selectedPrefs, setSelectedPrefs] = useState<Record<string, boolean>>({});
  const [accepted, setAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTerm();
  }, []);

  const fetchTerm = async () => {
    const res = await api.get('/terms?active=true');
    const activeTerm = res.data?.[0];
    if (activeTerm) setTerm(activeTerm);
  };

  const handleRegister = async () => {
    if (!name.trim()) return message.warning('Digite um nome');
    if (!accepted) return message.warning('Você precisa aceitar os termos para continuar');
    if (!term) return message.error('Termo ativo não encontrado');

    const preferencesMap: Record<string, boolean> = {};
    term.preferences?.forEach((pref: Preference) => {
      preferencesMap[pref.name] = selectedPrefs[pref.name] ?? false;
    });

    try {
      const res = await api.post('/users', {
        name,
        isAdmin: false,
        termId: term.id,
      });

      const user = res.data;

      await api.post('/terms/accept', {
        userId: user.id,
        termId: term.id,
        preferencesMap,
      });

      await api.put(`/preferences/${user.id}`, preferencesMap);

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (error) {
      message.error('Erro ao registrar ou aceitar termo.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        padding: 16,
      }}
    >
      <Card title="Cadastro de Usuário" style={{ width: 500 }}>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Nome" required>
            <Input
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          {term && (
            <>
              <Form.Item>
                <Checkbox
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                >
                  Aceito o termo de consentimento
                </Checkbox>
                <div>
                  <Button
                    type="link"
                    onClick={() => setShowModal(true)}
                    style={{ padding: 0 }}
                  >
                    Visualizar termo
                  </Button>
                </div>
              </Form.Item>

              {term.preferences?.length > 0 && (
                <Form.Item label="Preferências (opcional):">
                  {term.preferences.map((pref) => (
                    <Checkbox
                      key={pref.id}
                      checked={selectedPrefs[pref.name] || false}
                      onChange={(e) =>
                        setSelectedPrefs((prev) => ({
                          ...prev,
                          [pref.name]: e.target.checked,
                        }))
                      }
                      style={{ display: 'block', marginBottom: 8 }}
                    >
                      <Text strong>{pref.name}</Text>
                      <Paragraph type="secondary" style={{ margin: 0 }}>
                        {pref.description}
                      </Paragraph>
                    </Checkbox>
                  ))}
                </Form.Item>
              )}
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Criar Conta
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
          Já tem uma conta? <Link href="/">Faça login</Link>
        </Text>
      </Card>

      <Modal
        open={showModal}
        title="Termo de Consentimento"
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto' }}>
          {term?.content}
        </pre>
      </Modal>
    </div>
  );
}
