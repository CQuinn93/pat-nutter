const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

// Function to check if a column exists in a table
function columnExists(table, column, callback) {
    db.all(`PRAGMA table_info(${table})`, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            const columns = rows.map(row => row.name);
            callback(null, columns.includes(column));
        }
    });
}

// Add resetToken and resetTokenExpiry columns if they do not exist
db.serialize(() => {
    columnExists('users', 'resetToken', (err, exists) => {
        if (err) {
            console.error('Database check error:', err.message);
        } else if (!exists) {
            db.run('ALTER TABLE users ADD COLUMN resetToken TEXT', (err) => {
                if (err) {
                    console.error('Error adding resetToken column:', err.message);
                }
            });
        }
    });

    columnExists('users', 'resetTokenExpiry', (err, exists) => {
        if (err) {
            console.error('Database check error:', err.message);
        } else if (!exists) {
            db.run('ALTER TABLE users ADD COLUMN resetTokenExpiry INTEGER', (err) => {
                if (err) {
                    console.error('Error adding resetTokenExpiry column:', err.message);
                }
            });
        }
    });

    // Initial table creation
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    resetToken TEXT,
    resetTokenExpiry INTEGER
  )`);
});

module.exports = db;
