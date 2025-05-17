const http = require('http');
const WebSocket = require('ws');
const app = require('./app');

const port = 3000;
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

// 서버 실행
server.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});
