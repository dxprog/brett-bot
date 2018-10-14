const http = require('http');
const express = require('express');
const { server: WebSocketServer } = require('websocket');

const config = require('../config');

const app = express();
app.use(express.urlencoded());
const httpServer = http.createServer(app);
const socketServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false
});

let deviceConnection;

function sendMessage(message) {
  if (deviceConnection) {
    console.log('Sending message to device', message);
    deviceConnection.sendUTF(JSON.stringify(message));
  }
}

app.post('/eyes', (req, res) => {
  if (deviceConnection) {
    sendMessage({
      command: 'EYES',
      red: !!Number(req.body.red),
      green: !!Number(req.body.green),
      blue: !!Number(req.body.blue)
    });
  }
  res.send('OK');
});

app.post('/speak', (req, res) => {
  if (deviceConnection) {
    sendMessage({
      command: 'SPEAK',
      phrase: req.body.text
    });
  }
  res.send('OK');
});

httpServer.listen(config.port, () => {
  console.log(`Server listening on ${config.port}`);
});

socketServer.on('request', req => {
  const connection = req.accept(config.socketProtocol, req.origin);

  console.log(`Received incoming connection`);

  connection.on('close', (reason, description) => {
    console.log(`Connection closed: [${reason}] ${description}`);
    deviceConnection = null;
  });

  deviceConnection = connection;
});