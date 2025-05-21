const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://erickhoawata:IrVQY7meuuKZCuvX@appdb.hofc1ce.mongodb.net/?retryWrites=true&w=majority&appName=appDB")
  .then(() => console.log("🟢 MongoDB conectado"))
  .catch((err) => console.error("🔴 Erro ao conectar MongoDB:", err));

const User = mongoose.model("User", {
  name: String,
  email: String,
  cpf: String,
  age: Number,
  address: String,
  password: String,
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
