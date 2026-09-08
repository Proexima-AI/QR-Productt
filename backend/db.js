const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Attempt to connect to MySQL. If it fails, fallback to SQLite for local development.
let db;
let isMysql = false;

async function initDb() {
  try {
    // We will attempt MySQL first using the provided credentials
    const mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'u527069138_qrform',
      password: process.env.DB_PASSWORD || 'r7M7Y^qt?0!L',
      database: process.env.DB_NAME || 'u527069138_qrform',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000 // 5 seconds timeout to fallback quickly
    });

    // Test connection
    const connection = await mysqlPool.getConnection();
    console.log('✅ Connected to MySQL Database.');
    connection.release();
    db = mysqlPool;
    isMysql = true;

    await initTablesMysql(mysqlPool);
  } catch (error) {
    console.warn('⚠️ Could not connect to MySQL. Falling back to local SQLite for development.', error.message);
    
    // Fallback to SQLite
    db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
      if (err) {
        console.error('Error opening SQLite database', err.message);
      } else {
        console.log('✅ Connected to local SQLite database.');
        initTablesSqlite(db);
      }
    });
    isMysql = false;
  }
}

async function initTablesMysql(pool) {
  const usersQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      status ENUM('pending_setup', 'active') DEFAULT 'pending_setup',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const businessQuery = `
    CREATE TABLE IF NOT EXISTS businesses (
      id VARCHAR(255) PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255),
      tagline VARCHAR(255),
      category VARCHAR(255),
      owner_name VARCHAR(255),
      logo_url VARCHAR(1024),
      google_place_id VARCHAR(255),
      google_review_url VARCHAR(1024),
      target_keywords TEXT,
      offer_banner VARCHAR(1024),
      total_scans INT DEFAULT 0,
      google_review_count INT DEFAULT 0,
      avg_rating DECIMAL(2,1) DEFAULT 0.0,
      intercepted_bad_reviews INT DEFAULT 0,
      google_access_token TEXT,
      google_refresh_token TEXT,
      google_account_id VARCHAR(255),
      auto_reply_enabled BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const googleReviewsQuery = `
    CREATE TABLE IF NOT EXISTS google_reviews (
      review_id VARCHAR(255) PRIMARY KEY,
      business_id VARCHAR(255) NOT NULL,
      rating INT,
      comment TEXT,
      reviewer_name VARCHAR(255),
      ai_reply TEXT,
      reply_posted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );
  `;

  const feedbackQuery = `
    CREATE TABLE IF NOT EXISTS feedback (
      id VARCHAR(255) PRIMARY KEY,
      business_id VARCHAR(255) NOT NULL,
      rating INT,
      message TEXT,
      customer_name VARCHAR(255),
      customer_contact VARCHAR(255),
      date VARCHAR(255),
      status ENUM('Unresolved', 'Resolved') DEFAULT 'Unresolved',
      chips TEXT,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );
  `;

  await pool.query(usersQuery);
  await pool.query(businessQuery);
  await pool.query(googleReviewsQuery);
  await pool.query(feedbackQuery);
  console.log('✅ MySQL tables initialized.');
}

function initTablesSqlite(database) {
  database.serialize(() => {
    database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        status TEXT DEFAULT 'pending_setup',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT,
        tagline TEXT,
        category TEXT,
        owner_name TEXT,
        logo_url TEXT,
        google_place_id TEXT,
        google_review_url TEXT,
        target_keywords TEXT,
        offer_banner TEXT,
        total_scans INTEGER DEFAULT 0,
        google_review_count INTEGER DEFAULT 0,
        avg_rating REAL DEFAULT 0.0,
        intercepted_bad_reviews INTEGER DEFAULT 0,
        google_access_token TEXT,
        google_refresh_token TEXT,
        google_account_id TEXT,
        auto_reply_enabled INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS google_reviews (
        review_id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        rating INTEGER,
        comment TEXT,
        reviewer_name TEXT,
        ai_reply TEXT,
        reply_posted INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL,
        rating INTEGER,
        message TEXT,
        customer_name TEXT,
        customer_contact TEXT,
        date TEXT,
        status TEXT DEFAULT 'Unresolved',
        chips TEXT,
        FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ SQLite tables initialized.');
  });
}

initDb();

// Generic query function to abstract SQLite and MySQL differences
async function query(sql, params = []) {
  if (isMysql) {
    const [rows] = await db.execute(sql, params);
    return rows;
  } else {
    return new Promise((resolve, reject) => {
      // Replace ? with SQLite standard if needed, but sqlite uses ? too
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      } else {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          // For INSERT, sqlite returns this.lastID, mysql returns insertId
          else resolve({ insertId: this.lastID, changes: this.changes });
        });
      }
    });
  }
}

module.exports = { query };
