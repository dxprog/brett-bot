const WebSocketClient = require('websocket').client;
const SerialPort = require('serialport/test');

const config = require('../config');

const SOCKET_URL = `ws://localhost:${config.port}`;

SerialPort.Binding.createPort(config.serialPort, { echo: true, record: true });

const client = new WebSocketClient();
const serialPort = new SerialPort(config.serialPort)

const CMD_EYES = 0;
const CMD_HEAD = 1;
const CMD_RIGHT_ARM = 2;
const CMD_LEFT_ARM = 3;

const COMMANDS = {
  EYES(data) {
    const rgbValue = (data.red ? 0x4 : 0) | (data.green ? 0x2 : 0) | (data.blue ? 0x1 : 0);
    sendCommand(CMD_EYES, rgbValue);
  }
};

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