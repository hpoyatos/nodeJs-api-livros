const Database = require('better-sqlite3');
const path = require('path');

// Cria ou abre o arquivo biblioteca.db na raiz do projeto
const db = new Database(path.resolve(__dirname, '..', 'biblioteca.sqlite'));

// Cria a tabela 'livros' com ID auto-incrementado
db.exec(`
  CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    ano INTEGER NOT NULL
  )
`);

const count = db.prepare('SELECT COUNT(*) AS total FROM livros').get();
if (count.total === 0) {
  const insertInicial = db.prepare('INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)');
  insertInicial.run('O Senhor dos Anéis', 'J.R.R. Tolkien', 1954);
  insertInicial.run('1984', 'George Orwell', 1949);
}

module.exports = db;