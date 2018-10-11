const WebSocketClient = require('websocket').client;

const config = require('../config');

const SOCKET_URL = `ws://localhost:${config.port}`;

const client = new WebSocketClient();
function connect() {
  client.connect(SOCKET_URL, config.socketProtocol);
}

function messageReceived(message) {
  if (message.type === 'utf8') {
    try {
      const data = JSON.parse(message.utf8Data);
      console.log(data);
    } catch (err) {
      console.error(`Received bad data from fe-server: ${err}`);
    }
  }
}

client.on('connectFailed', err => {
  console.log(err);
});

client.on('connect', conn => {
  conn.on('error', err => {
    console.error(err);
  });
  conn.on('message', messageReceived);
  conn.on('close', connect);
});

connect();