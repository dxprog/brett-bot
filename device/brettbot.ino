#define RED_PIN   2
#define GREEN_PIN 3
#define BLUE_PIN  4

#define CMD_EYES       0
#define CMD_HEAD       1
#define CMD_RIGHT_ARM  2
#define CMD_LEFT_ARM   3

void setup() {
  Serial.begin(9600);

  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
}

/**
 * Waits for a byte from serial communications and returns it
 */
uint8_t readSerialByte() {
  while (Serial.available() == 0);
  return Serial.read();
}

/**
 * Updates the color of the eyes. RGB value should be passed as:
 *
 * (char) xxxxxRGB
 */
void cmdEyes() {
  uint8_t value = Serial.read();

  digitalWrite(RED_PIN, value & 0x4 > 1 ? HIGH : LOW);
  digitalWrite(GREEN_PIN, value & 0x2 > 1 ? HIGH : LOW);
  digitalWrite(BLUE_PIN, value & 0x1 > 1 ? HIGH : LOW);
}

void loop() {
  uint8_t cmd = readSerialByte();

  switch (cmd) {
    case CMD_EYES:
      cmdEyes();
      break;
  }
}