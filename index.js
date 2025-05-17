#!/usr/bin/env node

const app = require('./app');
const debug = require('debug')('book-cycle-backend:server');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();

const port = normalizePort('3000');
app.set('port', port);

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
    console.log('웹소켓 클라이언트 접속');

    ws.on('message', (message) => {
        console.log('메시지 수신:', message);
        ws.send(`서버 응답: ${message}`);
    });

    ws.on('close', () => {
        console.log('웹소켓 연결 종료');
    });
});

server.listen(port, () => console.log(`서버 실행 중: http://localhost:${port}`));
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const portNum = parseInt(val, 10);
    if (isNaN(portNum)) return val;
    if (portNum >= 0) return portNum;
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}