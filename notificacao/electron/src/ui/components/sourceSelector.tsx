import { useState } from "react";

export default function SourceSelector() {
  const [source, setSource] = useState<string>("");
  const [sqlitePath, setSqlitePath] = useState("");

  const handleSQLiteSource = async () => {
    const path = await window.electron.selectTemplate();
    if (path) setSqlitePath(path);
  };

  const renderForm = () => {
    switch (source) {
      case "mysql":
      case "postgres":
        return (
          <form style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <input placeholder="Host" name="host" />
            <input placeholder="Porta" name="port" />
            <input placeholder="Usuário" name="user" />
            <input placeholder="Senha" name="password" type="password" />
            <input placeholder="Banco de dados" name="database" />
          </form>
        );
      case "sqlite":
        return (
          <div style={{ flexDirection: "column" }}>
            <label>Selecionar arquivo .sqlite</label>
            <button type="button" onClick={handleSQLiteSource}>
              Selecionar arquivo
            </button>
            <span>{sqlitePath || "Nenhum arquivo selecionado"}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <select onChange={(event) => setSource(event.target.value)}>
        <option value="">Selecione uma fonte</option>
        <option value="mysql">MySQL</option>
        <option value="postgres">PostgreSQL</option>
        <option value="sqlite">SQLite</option>
      </select>

      {renderForm()}
    </div>
  );
}
