import { client as WebSocketClient, connection, IMessage } from 'websocket';
import * as SerialPort from 'serialport';
const SerialPortTest = require('serialport/test');

import config from '../config';
import { Espeak, IEspeakOptions } from './espeak';

const SOCKET_URL = `ws://${config.url}:${config.port}`;

const client = new WebSocketClient();

let serialPort: SerialPort;

const CONNECT_RETRY_DELAY = 30 * 1000;

enum Command {
  Eyes = 0,
  Head = 1,
  RightArm = 2,
  LeftArm = 3
}

interface ICommand {
  command: string;
}

interface IEyeColorCommand extends ICommand {
  red?: boolean;
  green?: boolean;
  blue?: boolean;
}

interface ISpeechCommand extends ICommand, IEspeakOptions {
  phrase: string;
}

const COMMANDS: any = {
  EYES(data: IEyeColorCommand) {
    const rgbValue = (data.red ? 0x4 : 0) | (data.green ? 0x2 : 0) | (data.blue ? 0x1 : 0);
    sendCommand(Command.Eyes, rgbValue);
  },
  SPEAK(data: ISpeechCommand) {
    // TODO - shouldn't have to instantiate this every time
    const espeak = new Espeak(data);
    espeak.speak(data.phrase);
  }
};

function retryApiConnect() {
  console.log(`Lost API connection. Will retry connection in ${CONNECT_RETRY_DELAY / 1000} seconds...`);
  setTimeout(() => {
    console.log('Retrying connection...');
    connectToApiServer();
  }, CONNECT_RETRY_DELAY);
}

function retryArduinoConnect() {
  console.log(`Lost Arduino connection. Will retry connection in ${CONNECT_RETRY_DELAY / 1000} seconds...`);
  setTimeout(() => {
    console.log('Retrying connection...');
    connectToArduino();
  }, CONNECT_RETRY_DELAY);
}

function connectToArduino() {
  if (config.serialTest) {
    console.log('Using mock serial port');
    SerialPortTest.Binding.createPort(config.serialPort, { echo: true, record: true });
    serialPort = new SerialPortTest(config.serialPort, {
      baudRate: config.serialBaud
    });
  } else {
    console.log('Using real serial port');
    serialPort = new SerialPort(config.serialPort, {
      baudRate: config.serialBaud
    });
  }
  serialPort.on('data', (data: Buffer) => {
    console.log('From Arduino: ', data.toString());
  });
  serialPort.on('close', retryArduinoConnect);
  serialPort.on('open', (err: any) => {
    if (!err) {
      console.log(`Listening to serial comms on port ${config.serialPort} @ ${config.serialBaud}`);
    }
  });
}

function connectToApiServer() {
  client.connect(SOCKET_URL, config.socketProtocol);
}

function messageReceived(message: IMessage) {
  if (message.type === 'utf8') {
    try {
      const data = JSON.parse(message.utf8Data);

      console.log('Received command', data);

      const { command } = data;
      if (COMMANDS.hasOwnProperty(command)) {
        COMMANDS[command](data);
      }
    } catch (err) {
      console.error(`Received bad data from fe-server: ${err}`);
      console.trace();
    }
  }
}

function sendCommand(command: number, data: number | Array<number>) {
  const dataToSend: Array<number> = Array.isArray(data) ? data : [ data ];
  console.log(`Sending command: ${command}`, dataToSend);
  dataToSend.unshift(command);
  serialPort.write(Buffer.from(dataToSend));
}

client.on('connectFailed', (err: any) => {
  console.error('Connection failed: ', err);
  retryApiConnect();
});

client.on('connect', (conn: connection) => {
  console.log('Connected to API server');
  conn.on('error', (err: any) => {
    console.error('An error occurred: ', err);
    retryApiConnect();
  });
  conn.on('message', messageReceived);
  conn.on('close', () => {
    console.log('Connection closed');
    retryApiConnect();
  });
});

connectToArduino();
connectToApiServer();
