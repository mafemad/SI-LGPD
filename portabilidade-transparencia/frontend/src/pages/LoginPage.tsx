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
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      <p>Não tem conta? <button onClick={() => navigate("/register")}>Criar Conta</button></p>
    </div>
  );
};

export default LoginPage;
