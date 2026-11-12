const express = require('express');

const app = express();
const cors = require('cors');
const db = require('./database');
const PORT = 3000;

// Para ensinar o Express a tratar e devolver requisições em formato JSON.
app.use(cors());
app.use(express.json());


// Programando o serviço "/" GET para não dar erro...
app.get('/', (req, res) => {
    return res.status(200).json({ mensagem: "Acesse /livros para manipular os livros."});
});

// Listagem de livros
app.get('/livros', (req, res) => {
    const stmt = db.prepare('SELECT * FROM livros ORDER BY id ASC');
    const livros = stmt.all();
    return res.status(200).json(livros);
})

// Consultar o livro por ID
app.get('/livros/:id', (req, res) => {
    const stmt = db.prepare('SELECT * FROM livros WHERE id = ?');
    const livro = stmt.get(req.params.id);

    if (!livro) {
        return res.status(404).json({ mensagem: "Livro não encontrado"});
    }
    return res.status(200).json(livro);
});

// Cadastrar novo livro
app.post('/livros', (req, res) => {
    const { titulo, autor, ano } = req.body;

    //Validação simples
    if (!titulo || !autor || !ano) {
        return res.status(400).json({ mensagem: "Campos 'titulo', 'autor' e 'ano' são obrigatórios"});
    }

    const stmt = db.prepare('INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)');
    const resultado = stmt.run(titulo, autor, Number(ano));

    // O SQLite devolve o ID gerado automaticamente via 'lastInsertRowid'
    const novoLivro = {
        id: Number(resultado.lastInsertRowid),
        titulo,
        autor,
        ano: Number(ano)
    };

    return res.status(201).json(novoLivro);
});

// Alterar um livro existente
app.put('/livros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor, ano } = req.body;

    //Validação simples
    if (!titulo || !autor || !ano) {
        return res.status(400).json({ mensagem: "Campos 'titulo', 'autor' e 'ano' são obrigatórios"});
    }
    const stmt = db.prepare('UPDATE livros SET titulo = ?, autor = ?, ano = ? WHERE id = ?');
    const resultado = stmt.run(titulo, autor, Number(ano), id);

    if (resultado.changes === 0) {
        return res.status(404).json({ mensagem: "Livro não encontrado para atualização." });
    }

    livro = { id,
        titulo,
        autor,
        ano: Number(ano)
    }

    return res.status(200).json(livro);
});

// Apagar um livro
app.delete('/livros/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM livros WHERE id = ?');
    const resultado = stmt.run(req.params.id);

    if (resultado.changes === 0) {
        return res.status(404).json({ mensagem: "Livro não encontrado para remoção." });
    }
    return res.status(204).send();
});

// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});