#define RED_PIN   2
#define GREEN_PIN 3
#define BLUE_PIN  4

#define CMD_EYES       0
#define CMD_HEAD       1
#define CMD_RIGHT_ARM  2
#define CMD_LEFT_ARM   3

void setup() {
  Serial.begin(115200);

  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
}

/**
 * Waits for a byte from serial communications and returns it
 */
byte readSerialByte() {
  while (Serial.available() == 0);
  byte retVal;
  while (Serial.available() > 0) {
    retVal = Serial.read();
  }
  return retVal;
}

/**
 * Updates the color of the eyes. RGB value should be passed as:
 *
 * (char) xxxxxRGB
 */
void cmdEyes() {
  long value = readSerialByte();
  Serial.print("Color value: ");
  Serial.println(value, HEX);

  digitalWrite(RED_PIN, value >> 2 & 0x1);
  digitalWrite(GREEN_PIN, value >> 1 & 0x1);
  digitalWrite(BLUE_PIN, value & 0x1);
}

void loop() {
  long cmd = readSerialByte();
  Serial.print("Received command: ");
  Serial.println(cmd, HEX);

  switch (cmd) {
    case CMD_EYES:
      cmdEyes();
      break;
  }
}