const WebSocketClient = require('websocket').client;
const { execFile } = require('child_process');
const request = require('request-promise-native');

const config = require('../config');

const SOCKET_URL = `ws://${config.url}:${config.port}`;

const client = new WebSocketClient();

let SerialPort;
let serialPort;
if (config.serialTest) {
  console.log('Using mock serial port');
  SerialPort = require('serialport/test');
  SerialPort.Binding.createPort(config.serialPort, { echo: true, record: true });
} else {
  console.log('Using real serial port');
  SerialPort = require('serialport');
}
serialPort = new SerialPort(config.serialPort);

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
    execFile('espeak', [ '-ven+m2', '-k5', '-s120', data.phrase ]);
  }
};

function retryConnect() {
  console.log(`Will retry connection in ${CONNECT_RETRY_DELAY / 1000} seconds...`);
  setTimeout(() => {
    console.log('Retrying connection...');
    connect();
  }, CONNECT_RETRY_DELAY);
}

function connect() {
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

function sendByteToDevice(value) {
  const byte = String.fromCharCode(value);
  serialPort.write(byte);
}

function sendCommand(command, data) {
  sendByteToDevice(command);
  const dataToSend = Array.isArray(data) ? data : [ data ];
  console.log(`Sending command: ${command}`, dataToSend);
  dataToSend.forEach(value => {
    sendByteToDevice(value);
  });
}

client.on('connectFailed', err => {
  console.error('Connection failed: ', err);
  retryConnect();
});

client.on('connect', conn => {
  console.log('Connected to API server');
  conn.on('error', err => {
    console.error('An error occurred: ', err);
    retryConnect();
  });
  conn.on('message', messageReceived);
  conn.on('close', () => {
    console.log('Connection closed');
    retryConnect();
  });
});

connect();
