const mysql = require('mysql2/promise');

let hyperdrive;
let initialized = false;
let initializing = null;

async function createConnection() {
  return mysql.createConnection({
    host: hyperdrive.host,
    user: hyperdrive.user,
    password: hyperdrive.password,
    database: hyperdrive.database,
    port: hyperdrive.port,
    disableEval: true
  });
}

async function initTablesMysql(pool) {
  const usersQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      status ENUM('pending_setup', 'active') DEFAULT 'pending_setup',
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      subscription_ends_at TIMESTAMP NULL
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
      mobile_number VARCHAR(255),
      top_selling_items TEXT,
      business_location VARCHAR(1024),
      ai_analysis_results TEXT,
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

  const paymentsQuery = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      razorpay_order_id VARCHAR(255),
      razorpay_payment_id VARCHAR(255),
      amount DECIMAL(10,2),
      plan_duration_days INT,
      status VARCHAR(50) DEFAULT 'success',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const supportTicketsQuery = `
    CREATE TABLE IF NOT EXISTS support_tickets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      subject VARCHAR(255),
      message TEXT,
      reply TEXT,
      status ENUM('open', 'closed') DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const crmLeadsQuery = `
    CREATE TABLE IF NOT EXISTS crm_leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(255),
      name VARCHAR(255),
      mobile VARCHAR(50),
      business_name VARCHAR(255),
      location VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(usersQuery);
  try {
    await pool.query("ALTER TABLE users ADD COLUMN subscription_ends_at TIMESTAMP NULL");
  } catch (err) {}
  try {
    await pool.query("ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'");
  } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN mobile_number VARCHAR(255)"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN top_selling_items TEXT"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN business_location VARCHAR(1024)"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN ai_analysis_results TEXT"); } catch (err) {}
  await pool.query(businessQuery);
  await pool.query(googleReviewsQuery);
  await pool.query(feedbackQuery);
  await pool.query(paymentsQuery);
  await pool.query(supportTicketsQuery);
  await pool.query(crmLeadsQuery);
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
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        subscription_ends_at DATETIME
      )
    `);

    // Safely add column if upgrading existing DB
    database.run(`ALTER TABLE users ADD COLUMN subscription_ends_at DATETIME`, (err) => {});
    database.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {});
    database.run(`ALTER TABLE businesses ADD COLUMN auto_reply_enabled INTEGER DEFAULT 0`, (err) => {
      // Ignore error if column already exists
    });
    database.run(`ALTER TABLE businesses ADD COLUMN mobile_number TEXT`, (err) => {});
    database.run(`ALTER TABLE businesses ADD COLUMN top_selling_items TEXT`, (err) => {});
    database.run(`ALTER TABLE businesses ADD COLUMN business_location TEXT`, (err) => {});
    database.run(`ALTER TABLE businesses ADD COLUMN ai_analysis_results TEXT`, (err) => {});

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
        mobile_number TEXT,
        top_selling_items TEXT,
        business_location TEXT,
        ai_analysis_results TEXT,
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

    database.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        amount REAL,
        plan_duration_days INTEGER,
        status TEXT DEFAULT 'success',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subject TEXT,
        message TEXT,
        reply TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS crm_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        name TEXT,
        mobile TEXT,
        business_name TEXT,
        location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ SQLite tables initialized.');
  });
}

async function query(sql, params = []) {
  if (!hyperdrive) {
    throw new Error('Hyperdrive binding is not initialized');
  }

  if (!initialized) {
    if (!initializing) {
      initializing = (async () => {
        const connection = await createConnection();

        try {
          await initTablesMysql(connection);
          initialized = true;
        } finally {
          await connection.end();
        }
      })();
    }

    await initializing;
  }

  const connection = await createConnection();

  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
}

function setHyperdrive(binding) {
  hyperdrive = binding;
}

module.exports = { query, setHyperdrive };