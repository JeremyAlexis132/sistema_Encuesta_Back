const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || '',
  database: process.env.DB_NAME || 'criptofrafia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
