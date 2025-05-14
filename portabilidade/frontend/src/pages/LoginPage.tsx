import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        throw new Error("Usuário não encontrado.");
      }

      const data = await res.json();
      const user = data.user;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);

      if (user.email === "admin@email.com") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      alert("Erro ao fazer login.");
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #d0e9f9, #f0f4f8)',
      fontFamily: 'Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '50px 40px',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        <h2 style={{
          marginBottom: '30px',
          color: '#2d3436',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Portabilidade de Dados
        </h2>

        <button
          onClick={() => navigate("/import")}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2ecc71'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
        >
          Importar Dados
        </button>
      </div>
    </div>
  );
};

export default LoginPage;