import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || './data/crypto_dice.db';

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database tables
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      telegram_id INTEGER UNIQUE NOT NULL,
      wallet_address TEXT,
      balance REAL DEFAULT 10.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Game history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      roll_result INTEGER NOT NULL,
      bet_amount REAL NOT NULL,
      win_amount REAL NOT NULL,
      is_win BOOLEAN NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  console.log('Database initialized successfully');
}

// User operations
export function getUserByTelegramId(telegramId: number) {
  const stmt = db.prepare('SELECT * FROM users WHERE telegram_id = ?');
  return stmt.get(telegramId) as any;
}

export function createUser(telegramId: number, walletAddress: string) {
  const stmt = db.prepare(`
    INSERT INTO users (telegram_id, wallet_address, balance) 
    VALUES (?, ?, 10.0)
  `);
  const result = stmt.run(telegramId, walletAddress);
  return result.lastInsertRowid;
}

export function updateUserBalance(userId: number, newBalance: number) {
  const stmt = db.prepare(`
    UPDATE users 
    SET balance = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  return stmt.run(newBalance, userId);
}

// Game history operations
export function addGameHistory(
  userId: number,
  rollResult: number,
  betAmount: number,
  winAmount: number,
  isWin: boolean
) {
  const stmt = db.prepare(`
    INSERT INTO game_history (user_id, roll_result, bet_amount, win_amount, is_win)
    VALUES (?, ?, ?, ?, ?)
  `);
  // Ensure all bound params are supported types (numbers/strings)
  const userIdNum = Number(userId);
  const rollNum = Number(rollResult);
  const betNum = Number(betAmount);
  const winNum = Number(winAmount);
  const isWinAsInt = isWin ? 1 : 0;

  return stmt.run(userIdNum, rollNum, betNum, winNum, isWinAsInt);
}

export function getGameHistory(userId: number, limit: number = 10) {
  const stmt = db.prepare(`
    SELECT * FROM game_history 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ?
  `);
  return stmt.all(userId, limit) as any[];
}

export default db;
