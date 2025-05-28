import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }) 
      });

      if (!res.ok) {
      
        if (res.status === 401) {
          alert("Senha incorreta ou usuário inválido.");
        } else if (res.status === 403) {
          alert("Muitas tentativas. Tente novamente em 10 minutos.");
        } else {
          alert("Erro ao fazer login.");
        }
        return;
      }

      const data = await res.json();
      const user = data.user;
      const token = data.access_token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("token", token);
      
      if (user.email === "admin@email.com") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
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
        borderRadius: '10px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '25px', color: '#333', width: '100%' }}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '95%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px'
          }}
        />

        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            placeholder="Senha"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '88%',
              padding: '12px',
              paddingRight: '40px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '5px',
              top: '40%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              color: '#555'
            }}
            aria-label="Mostrar ou ocultar senha"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
        onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#d1d5db',
            color: '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.3s, transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a1a1aa'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Login
        </button>


        <p style={{ color: '#555', marginTop: '20px' }}>
          Não tem conta?
          <button
            onClick={() => navigate("/register")}
            style={{
              background: 'none',
              border: 'none',
              color: '#5c7cfa',
              marginLeft: '6px',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 'bold'
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
