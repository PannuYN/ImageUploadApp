// db.js
const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');
const util = require('util');

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

// Promisify db.all and db.get for SELECT queries
const queryAsync = {
  all: util.promisify(db.all).bind(db), // For queries returning multiple rows
  get: util.promisify(db.get).bind(db), // For queries returning a single row
  run: util.promisify(db.run).bind(db) // For queries that do not return rows (INSERT, UPDATE, DELETE)
};

// Export the database instance and queryAsync functions for use in other files
module.exports = { db, queryAsync };
