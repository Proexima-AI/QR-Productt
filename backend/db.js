const mysql = require('mysql2/promise');

let hyperdrive;
let initialized = false;
let initializing = null;

async function createConnection() {
  if (hyperdrive) {
    return mysql.createConnection({
      host: hyperdrive.host,
      user: hyperdrive.user,
      password: hyperdrive.password,
      database: hyperdrive.database,
      port: hyperdrive.port,
      disableEval: true
    });
  }

  // Direct server MySQL connection (Hostinger / Node server / VPS / Production)
  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'u527069138_qrform',
    password: process.env.DB_PASSWORD || 'r7M7Y^qt?0!L',
    database: process.env.DB_NAME || 'u527069138_qrform',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
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
      google_review_url TEXT,
      target_keywords TEXT,
      offer_banner VARCHAR(1024),
      upi_id TEXT,
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
      language VARCHAR(50) DEFAULT 'en',
      business_details TEXT,
      seo_last_updated TIMESTAMP NULL,
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

  const chatLogsQuery = `
  CREATE TABLE IF NOT EXISTS chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

  const generatedReviewsQuery = `
    CREATE TABLE IF NOT EXISTS generated_reviews (
      id VARCHAR(255) PRIMARY KEY,
      business_id VARCHAR(255) NOT NULL,
      product VARCHAR(255),
      language VARCHAR(50),
      rating INT,
      review_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_gen_biz (business_id)
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
  try { await pool.query("ALTER TABLE businesses ADD COLUMN language VARCHAR(50) DEFAULT 'en'"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN auto_reply_enabled BOOLEAN DEFAULT FALSE"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN google_access_token TEXT"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN google_refresh_token TEXT"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN google_account_id VARCHAR(255)"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN business_details TEXT"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN seo_last_updated TIMESTAMP NULL"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN upi_id TEXT"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses ADD COLUMN intercepted_bad_reviews INT DEFAULT 0"); } catch (err) {}
  try { await pool.query("ALTER TABLE businesses MODIFY COLUMN google_review_url TEXT"); } catch (err) {}
  try { await pool.query("ALTER TABLE feedback ADD COLUMN customer_name VARCHAR(255)"); } catch (err) {}
  try { await pool.query("ALTER TABLE feedback ADD COLUMN customer_contact VARCHAR(255)"); } catch (err) {}
  try { await pool.query("ALTER TABLE feedback ADD COLUMN chips TEXT"); } catch (err) {}
  try { await pool.query("ALTER TABLE feedback ADD COLUMN product TEXT"); } catch (err) {}
  await pool.query(businessQuery);
  await pool.query(googleReviewsQuery);
  await pool.query(feedbackQuery);
  await pool.query(paymentsQuery);
  await pool.query(supportTicketsQuery);
  await pool.query(crmLeadsQuery);
  await pool.query(chatLogsQuery);
  await pool.query(generatedReviewsQuery);
  
  console.log('✅ MySQL tables initialized.');
}

async function query(sql, params = []) {
  // Sanitize all parameters to avoid mysql2 "Bind parameters must not contain undefined" errors
  const sanitizedParams = params.map(p => (p === undefined ? null : p));

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
    const [rows] = await connection.query(sql, sanitizedParams);
    return rows;
  } finally {
    await connection.end();
  }
}

function setHyperdrive(binding) {
  hyperdrive = binding;
}

module.exports = { query, setHyperdrive };