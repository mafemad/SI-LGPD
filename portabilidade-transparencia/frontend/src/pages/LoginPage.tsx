import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
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
    backgroundColor: '#f4f6f8',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333', width: '100%' }}>Login</h2>
      
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '95%',
          padding: '10px',
          marginBottom: '15px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        Entrar
      </button>

      <p style={{ color: '#555' }}>
        Não tem conta?
        <button
          onClick={() => navigate("/register")}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            marginLeft: '5px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Criar Conta
        </button>
      </p>
    </div>
  </div>
);

};

export default LoginPage;
