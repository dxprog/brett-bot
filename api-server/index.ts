import * as http from 'http';
import * as express from 'express';
import {
  server as WebSocketServer,
  request,
  connection
} from 'websocket';

// TODO: Old style import until the whole project is in TS
const config = require('../config');

const app = express();
app.use(express.urlencoded());
const httpServer = http.createServer(app);
const socketServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false
});

let deviceConnection: connection | null;

function sendMessage(message: any) {
  if (deviceConnection) {
    console.log('Sending message to device', message);
    deviceConnection.sendUTF(JSON.stringify(message));
  }
}

app.post('/eyes', (req: express.Request, res: express.Response) => {
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

app.post('/speak', (req: express.Request, res: express.Response) => {
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

socketServer.on('request', (req: request) => {
  const connection: connection = req.accept(config.socketProtocol, req.origin);

  console.log(`Received incoming connection`);

  connection.on('close', (reason: any, description: any) => {
    console.log(`Connection closed: [${reason}] ${description}`);
    deviceConnection = null;
  });

  deviceConnection = connection;
});