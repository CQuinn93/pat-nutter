const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('patNutter.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    resetToken TEXT,
    resetTokenExpiry INTEGER
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS competitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT,
    description TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_competitions (
    userId INTEGER,
    competitionId INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(competitionId) REFERENCES competitions(id)
  )`);
});

module.exports = db;
