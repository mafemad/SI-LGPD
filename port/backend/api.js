import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./user.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const connetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Conectado ao MongoDB')
    } catch (error) {
        console.log('Deu erro ao Conectar com o MongDB')
    }
};

connetDB();


//create
app.post("/user", async (req, res) => {
    try{
        const novoUser = await user.create(req.body);
        res.json(novoUser);
    } catch (error) {
        res.json({error: error});
    }
});

//read
app.get("/user", async (req, res) => {
    try {
        const users = await user.find()
        res.json(users);
    } catch (error) {
        res.json({ error: error });
    }
})

//update
app.put("/user/:id", async (req, res) => {
    req.params.id
    try {
        const novoUser = await user.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        res.json(novoUser);
    } catch (error) {
        res.json({ error: error });
    }
})

//delete
app.delete("/user/:id", async (req, res) => {
    req.params.id
    try {
        const userExcluido = await user.findByIdAndDelete(
            req.params.id
        );
        res.json(userExcluido);
    } catch (error) {
        res.json({ error: error });
    }
})

app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));