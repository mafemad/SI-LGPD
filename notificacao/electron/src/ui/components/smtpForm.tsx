import { useState } from "react";

declare global {
  interface Window {
    electron: {
      selectTemplate: () => Promise<string>;
      sendMails: (params: any) => Promise<{ success: boolean; error?: string }>;
    };
  }
}

export default function SMTPForm() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [templatePath, setTemplatePath] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // 👈 estado de feedback
  const [statusColor, setStatusColor] = useState("black"); // opcional: cor de feedback

  const handleSelectTemplate = async () => {
    const path = await window.electron.selectTemplate();
    if (path) setTemplatePath(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatusMessage("Enviando e-mails...");
    setStatusColor("blue");

    const params = { host, pass: password, port, template: templatePath, user };

    try {
      const result = await window.electron.sendMails(params);

      if (result.success) {
        setStatusMessage("✅ E-mails enviados com sucesso!");
        setStatusColor("green");
      } else {
        setStatusMessage("❌ Erro ao enviar e-mails: " + result.error);
        setStatusColor("red");
      }
    } catch (err) {
      setStatusMessage("❌ Erro inesperado ao tentar enviar os e-mails.");
      setStatusColor("red");
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "300px",
      }}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Host"
        onChange={(e) => setHost(e.target.value)}
      />
      <input
        type="text"
        placeholder="Port"
        onChange={(e) => setPort(e.target.value)}
      />
      <input
        type="text"
        placeholder="User"
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div style={{ flexDirection: "column" }}>
        <div
          style={{ justifyContent: "space-between", alignContent: "center", gap: "2px" }}
        >
          <label
            style={{ justifyContent: "space-between", alignContent: "center" }}
          >
            Template
          </label>
          <button type="button" onClick={handleSelectTemplate}>
            Selecionar arquivo
          </button>
        </div>
        <span>{templatePath || "Nenhum arquivo selecionado"}</span>
      </div>

      <button type="submit">Enviar e-mails</button>

      {statusMessage && (
        <div style={{ marginTop: "10px", color: statusColor }}>
          {statusMessage}
        </div>
      )}
    </form>
  );
}
