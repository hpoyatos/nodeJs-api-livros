const express = require('express');

const app = express();
const PORT = 3000;

// Para ensinar o Express a tratar e devolver requisições em formato JSON.
app.use(express.json());


// Programando o serviço "/" GET para não dar erro...
app.get('/', (req, res) => {
    return res.status(200).json({ mensagem: "Acesse /livros para manipular os livros."});
});

// Nosso "banco de dados" de livros........
let livros = [
    { id: 1, titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", ano: 1954},
    { id: 2, titulo: "1984", autor: "George Orwell", ano: 1949}
];

// Listagem de livros
app.get('/livros', (req, res) => {
    return res.status(200).json(livros);
})

// Consultar o livro por ID
app.get('/livros/:id', (req, res) => {
    const idBuscado = req.params.id;

    const livro = livros.find(l => l.id == idBuscado);

    if (!livro) {
        return res.status(404).json({ mensagem: "Livro não encontrado"});
    }
    return res.status(200).json(livro);
});

// Declarar o próximo ID
let proximoId = 3;

// Cadastrar novo livro
app.post('/livros', (req, res) => {
    const { titulo, autor, ano } = req.body;

    //Validação simples
    if (!titulo || !autor || !ano) {
        return res.status(400).json({ mensagem: "Campos 'titulo', 'autor' e 'ano' são obrigatórios"});
    }

    const novoLivro = {
        id: proximoId++,
        titulo,
        autor,
        ano: Number(ano)
    };

    livros.push(novoLivro);

    return res.status(201).json(novoLivro);
});

// Alterar um livro existente
app.put('/livros/:id', (req, res) => {
    const idBuscado = req.params.id;

    const indice = livros.findIndex(l => l.id == idBuscado); 

    if (indice === -1) {
        return res.status(400).json({ mensagem: "Livro não encontrado para atualização."});
    }

    const { titulo, autor, ano } = req.body;

    //Validação simples
    if (!titulo || !autor || !ano) {
        return res.status(400).json({ mensagem: "Campos 'titulo', 'autor' e 'ano' são obrigatórios"});
    }
    
    livros[indice] = { id: idBuscado,
        titulo,
        autor,
        ano: Number(ano)
    }

    return res.status(200).json(livros[indice]);
});

// Apagar um livro
app.delete('/livros/:id', (req, res) => {
    const idBuscado = req.params.id;

    const indice = livros.findIndex(l => l.id == idBuscado); 

    if (indice === -1) {
        return res.status(400).json({ mensagem: "Livro não encontrado para remoção."});
    }

    livros.splice(indice, 1);
    return res.status(204).send();
});

// Inicializar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});