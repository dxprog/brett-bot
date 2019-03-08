import * as cors from 'cors';
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import { UploadedFile } from 'express-fileupload';
import * as http from 'http';
import {
  server as WebSocketServer,
  request,
  connection
} from 'websocket';

import config from '../config';
import { Logger } from './logger';
import { Soundbite } from './soundbite';

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024; // 2MB

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload({
  // 2MB filesize limit
  limits: { fileSize: MAX_UPLOAD_SIZE },
  abortOnLimit: true
}))
const httpServer = http.createServer(app);
const socketServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false
});

let deviceConnection: connection | null;
const logger = new Logger(config.dbPath);
const soundbite = new Soundbite(config.dbPath, config.soundbitePath);

function sendMessage(message: any) {
  if (deviceConnection) {
    console.log('Sending message to device', message);
    logger.log(message.command, message);
    deviceConnection.sendUTF(JSON.stringify(message));
  }
}

app.get('/status', (req: express.Request, res: express.Response) => {
  res.json({
    connected: !!deviceConnection
  });
});

app.get('/log', async (req: express.Request, res: express.Response) => {
  const since = req.query.since || Date.now() - (3600 * 12 * 1000);
  const logs = await logger.fetch(since);
  res.json(logs);
});

app.get('/soundbites', async(req: express.Request, res: express.Response) => {
  const soundbites = await soundbite.getSoundbites();
  res.json(soundbites);
});

app.get('/soundbite/:fileName', async (req: express.Request, res: express.Response) => {
  const fileData = await soundbite.getSoundbite(req.params.fileName);
  if (fileData) {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(fileData);
  } else {
    res.sendStatus(404);
  }
});

app.post('/soundbite', async (req: express.Request, res: express.Response) => {
  const result = await soundbite.createSoundbite(req.body.name, req.body.shortcode || null, (<UploadedFile>req.files.soundFile).data);
  if (result) {
    res.json(true);
  } else {
    res.sendStatus(400);
  }
});

app.post('/:command', (req: express.Request, res: express.Response) => {
  sendMessage({
    command: req.params.command,
    ...req.body
  });
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