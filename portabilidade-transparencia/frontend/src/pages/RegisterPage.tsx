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
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px'
    }}>
      <h2 style={{ marginBottom: '60px', color: '#333', textAlign: 'center' }}>Cadastro</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          
        />
        <input
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          
        />
        <input
          placeholder="Idade"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          
        />
        <input
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          
        />
        <button
          onClick={handleCreate}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3f51b5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#303f9f'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3f51b5'}
        >
          Criar Conta
        </button>
      </div>
    </div>
  </div>
);

};

export default RegisterPage;
