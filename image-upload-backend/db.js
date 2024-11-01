// db.js
const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');

// Ensure the directory exists for the database file
mkdirp.sync('./var/db');

// Create a new SQLite database instance
const db = new sqlite3.Database('./var/db/todos.db');

// Create tables if they don't exist
db.serialize(() => {
  // Users table with username and profile_pic columns
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    profile_pic TEXT
  )`);

  // Images table with url and user_id columns
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`);
});

// Export the database instance for use in other files
module.exports = db;
