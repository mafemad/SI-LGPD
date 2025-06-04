import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Pega o token da URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      alert("Token não encontrado na URL.");
      navigate("/logi");
      return;
    }

    // Exibe o token no console
    console.log("Token recebido:", token);

    // Salva o token no cookie (com validade de 7 dias)
    Cookies.set("token", token, { expires: 7, secure: true, sameSite: "lax" });

    // Redireciona para dashboard ou página principal após salvar cookie
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
      color: "#333"
    }}>
      <p>Carregando...</p>
    </div>
  );
};

export default CallbackPage;
