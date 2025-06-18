import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shareData, setShareData] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        cpf,
        age: Number(age),
        address,
        password,
        shareData,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Erro ao criar conta.");
      return;
    }

    localStorage.setItem("userId", data.id);
    navigate("/login");
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
          <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
          <input placeholder="Idade" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          <input placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} />

          <div style={{ position: 'relative' }}>
            <input
              placeholder="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '93%',
                padding: '12px 40px 12px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '5px',
                top: '35%',
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

          <div style={{ position: 'relative' }}>
            <input
              placeholder="Confirmar Senha"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '93%',
                padding: '12px 40px 12px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '5px',
                top: '35%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#555'
              }}
              aria-label="Mostrar ou ocultar confirmação de senha"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={shareData}
              onChange={(e) => setShareData(e.target.checked)}
              id="shareData"
            />
            <label htmlFor="shareData" style={{ fontSize: '14px', color: '#333' }}>
              Permitir portabilidade de dados
            </label>
          </div>

          {error && <p style={{ color: "red", marginTop: '5px' }}>{error}</p>}

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
