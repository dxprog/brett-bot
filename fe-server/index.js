const http = require('http');
const express = require('express');
const { server: WebSocketServer } = require('websocket');

const config = require('../config');

const app = express();
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

app.get('/red', (req, res) => {
  if (deviceConnection) {
    sendMessage({
      command: 'EYES',
      red: true,
      green: false,
      blue: false
    });
    res.send('OK');
  }
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