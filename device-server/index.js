const WebSocketClient = require('websocket').client;

const client = new WebSocketClient();

const SOCKET_URL = 'ws://localhost:4242';

function connect() {
  client.connect(SOCKET_URL, 'brettbot');
}

function dataReceived(data) {
  console.log(data.utf8Data);
}

client.on('connectFailed', err => {
  console.log(err);
});

client.on('connect', conn => {
  conn.on('error', err => {
    console.error(err);
  });
  conn.on('message', dataReceived);
  conn.on('close', connect);
});

connect();