import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PortabilityCallback(): JSX.Element {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        console.log("Token recebido:", token);
        try {
          await loginWithToken(token); // Aguarda o login
          navigate("/profile");
        } catch (err) {
          console.error("Erro ao fazer login com token:", err);
          alert("Erro ao processar token.");
          navigate("/login");
        }
      } else {
        alert("Token não encontrado na URL.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, loginWithToken]);

  return <p>Autenticando com Sistema I...</p>;
}
