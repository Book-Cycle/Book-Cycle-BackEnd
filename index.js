#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('book-cycle-backend:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);  // app.set() 함수는 `express` 앱에서 사용

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log(`서버 실행 중: http://localhost:${port}`));

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


const connection = require('./DB/db'); 
require('dotenv').config();

// MySQL과 DynamoDB 연결 확인
const checkConnections = async () => {
  try {
    // MySQL 연결 확인 (Promise로 변환)
    await new Promise((resolve, reject) => {
      connection.getConnection((err, conn) => {
        if (err) {
          console.error("MySQL 연결 실패: ", err);
          reject(err);
          return;
        }
        conn.release();
        console.log("MySQL 연결 성공");
        resolve();
      });
    });
  }
  catch (err) {
    console.error("MySQL 연결 확인 중 오류 발생: ", err);
  }
}

checkConnections();