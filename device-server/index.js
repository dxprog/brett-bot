const WebSocketClient = require('websocket').client;
const { execFile } = require('child_process');
const request = require('request-promise-native');

const config = require('../config');
const Espeak = require('./espeak');

const SOCKET_URL = `ws://${config.url}:${config.port}`;

const client = new WebSocketClient();

let serialPort;

const CONNECT_RETRY_DELAY = 30 * 1000;
const CMD_EYES = 0;
const CMD_HEAD = 1;
const CMD_RIGHT_ARM = 2;
const CMD_LEFT_ARM = 3;

const COMMANDS = {
  EYES(data) {
    const rgbValue = (data.red ? 0x4 : 0) | (data.green ? 0x2 : 0) | (data.blue ? 0x1 : 0);
    sendCommand(CMD_EYES, rgbValue);
  },
  SPEAK(data) {
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
  let SerialPort;
  if (config.serialTest) {
    console.log('Using mock serial port');
    SerialPort = require('serialport/test');
    SerialPort.Binding.createPort(config.serialPort, { echo: true, record: true });
  } else {
    console.log('Using real serial port');
    SerialPort = require('serialport');
  }
  serialPort = new SerialPort(config.serialPort, {
    baudRate: config.serialBaud
  });
  serialPort.on('data', data => {
    console.log('From Arduino: ', data.toString());
  });
  serialPort.on('close', retryArduinoConnect);
  serialPort.on('open', err => {
    if (!err) {
      console.log(`Listening to serial comms on port ${config.serialPort} @ ${config.serialBaud}`);
    }
  });
}

function connectToApiServer() {
  client.connect(SOCKET_URL, config.socketProtocol);
}

function messageReceived(message) {
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

function sendCommand(command, data) {
  const dataToSend = Array.isArray(data) ? data : [ data ];
  console.log(`Sending command: ${command}`, dataToSend);
  dataToSend.unshift(command);
  serialPort.write(Buffer.from(dataToSend));
}

client.on('connectFailed', err => {
  console.error('Connection failed: ', err);
  retryApiConnect();
});

client.on('connect', conn => {
  console.log('Connected to API server');
  conn.on('error', err => {
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
