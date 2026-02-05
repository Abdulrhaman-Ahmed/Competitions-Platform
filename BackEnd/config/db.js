const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  charset: 'utf8mb4',
  multipleStatements: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

// Test connection
promisePool.query('SELECT 1')
  .then(() => {
    console.log('✅ MySQL Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ MySQL Connection Error:');
    console.error('   Error Code:', err.code);
    console.error('   Error Message:', err.message);
    console.error('   Connection Details:');
    console.error('   - Host:', process.env.DB_HOST);
    console.error('   - User:', process.env.DB_USER);
    console.error('   - Database:', process.env.DB_NAME);
    console.error('   Please check your .env file and ensure:');
    console.error('   - MySQL server is running');
    console.error('   - DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME are correct');
    console.error('   - Database exists or you have permission to create it');
  });

module.exports = promisePool;
