import { Button, Form, Typography, Card } from 'antd';

export default function Login() {
  const onSubmit = async () => {
    window.location.assign(
      `http://localhost:5173/portabilidade/login?&redirectTo=http://localhost:5174/portabilidade/login/`
    );
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #e0f2ff, #cce4ff)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          border: 'none',
          background: '#ffffffdd',
        }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
            marginBottom: 10,
            color: '#003366',
            fontWeight: 600,
          }}
        >
          Sistema I
        </Typography.Title>
        <Typography.Text
          style={{
            display: 'block',
            textAlign: 'center',
            marginBottom: 24,
            color: '#4a4a4a',
          }}
        >
          Faça o login através de um sistema parceiro!
        </Typography.Text>

        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item>
            <Button
              type="primary"
              size="large"
              block
              style={{
                background: '#0050b3',
                borderColor: '#0050b3',
                borderRadius: 8,
              }}
              onClick={() =>
                (window.location.href = 'http://localhost:5174/portabilidade/login')
              }
            >
              Fazer Login com Sistema II
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
