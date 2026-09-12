const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite');
db.run("UPDATE users SET password_hash = '$2b$10$lHG67cpCym6DcTf2N9mlCunTZLM5IQ2i7Pny7QBRZZ2RYHqp7pBqy' WHERE email = 'test@proexima.com'", (err) => {
    if (err) console.error(err);
    else console.log("Password reset successfully for test@proexima.com to 'admin123'");
    db.close();
});
