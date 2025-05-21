import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = "http://localhost:3000/user";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(api);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${api}/${editId}`, form);
    } else {
      await axios.post(api, form);
    }
    setForm({ name: '', email: '' });
    setEditId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${api}/${id}`);
    fetchUsers();
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>CRUD de Usuários</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ marginRight: '10px' }}
        />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user._id} style={{ marginBottom: '10px' }}>
            <strong>{user.name}</strong> - {user.email}
            <button onClick={() => handleEdit(user)} style={{ marginLeft: '10px' }}>Editar</button>
            <button onClick={() => handleDelete(user._id)} style={{ marginLeft: '5px' }}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
