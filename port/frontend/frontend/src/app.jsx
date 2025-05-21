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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          {editId ? 'Atualizar' : 'Adicionar'}
        </button>
      </form>

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u._id} className="border p-2 flex justify-between items-center">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p>{u.email}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(u)} className="text-blue-600">Editar</button>
              <button onClick={() => handleDelete(u._id)} className="text-red-600">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
