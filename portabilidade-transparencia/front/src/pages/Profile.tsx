import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const data = query.get("data");

    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setUser(decoded);
        localStorage.setItem("user", JSON.stringify(decoded)); // opcional
      } catch (err) {
        console.error("Erro ao decodificar dados:", err);
      }
    }
  }, []);

  if (!user) return <div>Carregando dados...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Perfil Importado</h1>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>CPF:</strong> {user.cpf}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Endereço:</strong> {user.address}</p>
      <p><strong>Idade:</strong> {user.age}</p>
    </div>
  );
}
