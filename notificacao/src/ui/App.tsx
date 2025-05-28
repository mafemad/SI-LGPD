import { useState } from "react";
import "./App.css";
import SMTPForm from "./components/smtpForm";
import SourceSelector from "./components/sourceSelector";

function App() {
  const [source, setSource] = useState<string>("");
  const [sqlitePath, setSqlitePath] = useState<string>("");

  return (
    <div style={{ display: "block" }}>
      <h1>Mailer</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          margin: "auto",
        }}
      >
        <SourceSelector
          source={source}
          setSource={setSource}
          sqlitePath={sqlitePath}
          setSqlitePath={setSqlitePath}
        />
        <hr></hr>
        <SMTPForm path={sqlitePath} />
      </div>
    </div>
  );
}

export default App;
