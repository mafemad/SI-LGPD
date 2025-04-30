import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
};

type ExportHistory = {
  id: number;
  format: string;
  createdAt: string;
  userName: string;
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [history, setHistory] = useState<ExportHistory[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const viewHistory = async (userId: number) => {
    setSelectedUserId(userId);
    const res = await fetch(`http://localhost:3000/export-history/user/${userId}`);
    const data = await res.json();
    setHistory(data);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administração</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>Usuários:</h3>
      <ul>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: 10 }}>
            <strong>{user.name}</strong> - {user.email}
            <button onClick={() => viewHistory(user.id)} style={{ marginLeft: 10 }}>
              Ver Histórico
            </button>
          </li>
        ))}
      </ul>

      {selectedUserId && (
        <>
          <h3>Histórico de Exportações</h3>
          <ul>
            {history.map(h => (
              <li key={h.id}>
                {h.format.toUpperCase()} - {new Date(h.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
