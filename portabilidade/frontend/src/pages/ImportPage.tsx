import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ImportPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    const res = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password}),
    });

    const user = await res.json();
    localStorage.setItem("userId", user.id);
    navigate("/user");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d0e9f9, #f0f4f8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '50px 40px',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '480px'
      }}>
        <h2 style={{
          marginBottom: '30px',
          color: '#2d3436',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Portabilidade de Dados
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '12px 14px',
              border: '1px solid #dfe6e9',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
            onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
          />
          <input
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '12px 14px',
              border: '1px solid #dfe6e9',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
            onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: '14px',
              backgroundColor: '#3f51b5',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#303f9f'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3f51b5'}
          >
            Trazer seus dados
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
