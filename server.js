const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com MongoDB (Ajuste sua String aqui)
mongoose.connect('mongodb://localhost:27017/crud_aula');

// Model com Telefone e Data (Desafio 1 e 3)
const Pessoa = mongoose.model('Pessoa', {
    nome: { type: String, required: true }, // Desafio 4: Validação
    email: { type: String, required: true }, // Desafio 4: Validação
    telefone: String,
    criadoEm: { type: Date, default: Date.now }
});

// Rotas
app.get('/pessoas', async (req, res) => {
    const { nome } = req.query;
    let filtro = {};
    
    // Desafio 2: Busca por nome
    if (nome) {
        filtro.nome = { $regex: nome, $options: 'i' };
    }

    // Desafio 3: Ordenar por data (mais recente primeiro: -1)
    const pessoas = await Pessoa.find(filtro).sort({ criadoEm: -1 });
    res.json(pessoas);
});

app.post('/pessoas', async (req, res) => {
    try {
        const novaPessoa = new Pessoa(req.body);
        await novaPessoa.save();
        res.status(201).json(novaPessoa);
    } catch (err) {
        res.status(400).json({ message: "Nome e Email são obrigatórios no Back-end!" });
    }
});

app.put('/pessoas/:id', async (req, res) => {
    await Pessoa.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Atualizado!" });
});

app.delete('/pessoas/:id', async (req, res) => {
    await Pessoa.findByIdAndDelete(req.params.id);
    res.json({ message: "Removido!" });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));