import "./App.css";
import SMTPForm from "./components/smtpForm";
import SourceSelector from "./components/sourceSelector";
function App() {
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
        <SourceSelector />
        <hr></hr>
        <SMTPForm />
      </div>
    </div>
  );
}

export default App;
