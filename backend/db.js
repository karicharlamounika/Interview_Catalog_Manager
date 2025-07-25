const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./catalogmanager.db", (err) => {
  if (err) return console.error(err.message);
  console.log("✅ Connected to the SQLite database.");
});

// Recreate table if needed (optional for dev only)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1
    )
  `);
  db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);
});

module.exports = db;
