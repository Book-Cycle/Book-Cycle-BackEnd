const mysql = require('mysql2');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectTimeout: 20000,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const pool = mysql.createPool(config);
const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    switch (err.code) {
      case 'PROTOCOL_CONNECTION_LOST':
        console.error('Database connection was closed.');
        break;
      case 'ER_CON_COUNT_ERROR':
        console.error('Database has too many connections.');
        break;
      case 'ECONNREFUSED':
        console.error('Database connection was refused.');
        break;
      case 'ETIMEDOUT':
        console.error('Database connection timed out.');
        break;
      default:
        console.error('Database connection error:', err);
    }
    return;
  }
  connection.release();
  console.log('MySQL 연결 성공');
});

module.exports = pool;