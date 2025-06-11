import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Card, Form, Input, Button, Typography, message } from 'antd';

const { Title, Text } = Typography;

export default function Login() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name.trim()) {
      message.warning('Digite um nome');
      return;
    }

    try {
      const res = await api.post('/auth/login', { name });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      message.error('Usuário não encontrado');
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
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Login
        </Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item label="Nome" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
          Não tem conta?{' '}
          <Link to="/register">
            <Text type="secondary" strong>
              Cadastre-se
            </Text>
          </Link>
        </Text>
      </Card>
    </div>
  );
}
