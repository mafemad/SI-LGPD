import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        cpf,
        age: Number(age),
        address,
      }),
    });

    const user = await res.json();
    localStorage.setItem("userId", user.id);
    navigate("/user");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cadastro</h2>
      <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
      <input placeholder="Idade" value={age} onChange={(e) => setAge(e.target.value)} />
      <input placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={handleCreate}>Criar Conta</button>
    </div>
  );
};

export default RegisterPage;
