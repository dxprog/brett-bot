import * as cors from 'cors';
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import * as fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import * as http from 'http';
import * as mm from 'music-metadata';
import * as path from 'path';
import {
  server as WebSocketServer,
  request,
  connection
} from 'websocket';

import config from '../config';
import { Logger } from './logger';

const SOUND_BITE_LOCATION = path.resolve('./soundbites');
const SOUND_BITE_MAX_DURATION = 20;
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
let logger = new Logger(config.dbPath);

function sendMessage(message: any) {
  if (deviceConnection) {
    console.log('Sending message to device', message);
    logger.log(message.command, message);
    deviceConnection.sendUTF(JSON.stringify(message));
  }
}

app.post('/:command', (req: express.Request, res: express.Response) => {
  sendMessage({
    command: req.params.command,
    ...req.body
  });
  res.send('OK');
});

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

app.post('/soundbite', async (req: express.Request, res: express.Response) => {
  const uploadedFile: UploadedFile = <UploadedFile>req.files.soundUpload;
  if (uploadedFile) {
    const id3Tags = await mm.parseBuffer(uploadedFile.data);
    if (id3Tags && id3Tags.format.duration < SOUND_BITE_MAX_DURATION) {

    } else {
      res.sendStatus(415);
    }
  } else {
    res.sendStatus(412);
  }
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