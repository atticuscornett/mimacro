// This #include statement was automatically added by the Particle IDE.
#include <IRremote.h>

STARTUP(System.enableFeature(FEATURE_RETAINED_MEMORY));


// Fun workaround for IRRemote not allowing dynamically switching the IR port.
retained int IRpin = -1;

IRrecv irrecv(1);
decode_results results;

// Digital Pins 0-7 Setup
/*
  0 - Empty
  1 - Button
  2 - IR Receiver
*/

int digitalConfig[] = { 0, 0, 0, 0, 0, 0, 0, 0 };
int digitalTimeout[] = { 20, 20, 20, 20, 20, 20, 20, 20 };
bool digitalLastState[] = { false, false, false, false, false, false, false, false };
unsigned long digitalLastStateChange[] = { 0, 0, 0, 0, 0, 0, 0, 0 };

// Analog Pins A0-A5 Setup
/*
  0 - Empty
  1 - Button
  40 - Potentiometer
*/

int analogConfig[] = { 0, 0, 0, 0, 0, 0 };
int analogTimeout[] = { 40, 40, 40, 40, 40, 40 };
int analogLastState[] = { 0, 0, 0, 0, 0, 0 };
int analogChangeMin[] = { 25, 25, 25, 25, 25, 25 };
unsigned long analogLastStateChange[] = { 0, 0, 0, 0, 0, 0 };

String serialBuffer = "";
String version = "PHOTON 0.0.1";


void setup() {
  Serial.begin(9600);
  Serial.println("mimacro");
  Serial.println(version);
  if (IRpin != -1){
      //irrecv.enableIRIn();
  }
  loadEEPROM();
}

void loop() {
  handleSerialCommands();

  for (int i = 0; i < 8; i++) {
    handleDigitalPin(i);
  }

  for (int i = 10; i < 16; i++) {
    handleAnalogPin(i);
  }
}


/*
  Memory Addresses
  0-7 - Digital Pin Modes
  8-13 - Analog Pin Modes
  14-21 - Digital Pin Timeouts
  22-27 - Analog Pin Timeouts
  28-33 - Analog Pin Minimum Reported Changes
*/

void loadEEPROM() {
  int read;
  int correctIRPin = -1;
  // Load button config from EEPROM
  for (int i = 0; i < 8; i++) {
    read = EEPROM.read(i);
    // Check validity -- REMOVED
    digitalConfig[i] = read;
    // Configure digital pins
    configureDigitalPin(i);
    if (digitalConfig[i] == 2){
        correctIRPin = i;
    }
  }

  if (correctIRPin != IRpin) {
      IRpin = correctIRPin;
      Serial.println("Reconfiguring IR pin requires a restart.");
      delay(3000);
      System.reset();
  }


  Serial.println(intArrayToString(digitalConfig, 8));

  for (int i = 8; i < 14; i++) {
    read = EEPROM.read(i);
    // Check validity
    if (read > 100) {
      // Memory is invalid, reset memory;
      EEPROMReset();
      break;
    }
    analogConfig[i - 8] = read;
    // Configure analog pins
    configureAnalogPin(i+2);
  }
  Serial.println(intArrayToString(analogConfig, 6));

  for (int i = 14; i < 22; i++) {
    digitalTimeout[i - 14] = EEPROM.read(i);
  }
  Serial.println(intArrayToString(digitalTimeout, 8));

  for (int i = 22; i < 28; i++) {
    analogTimeout[i - 22] = EEPROM.read(i);
  }
  Serial.println(intArrayToString(analogTimeout, 6));

  for (int i = 28; i < 34; i++) {
    analogChangeMin[i - 28] = EEPROM.read(i);
  }
  Serial.println(intArrayToString(analogChangeMin, 6));
}

void EEPROMReset() {
  for (int j = 0; j < 8; j++) {
    digitalConfig[j] = 0;
    EEPROM.update(j, 0);
  }
  for (int j = 8; j < 14; j++) {
    analogConfig[j - 12] = 0;
    EEPROM.update(j, 0);
  }
  for (int j = 14; j < 22; j++) {
    digitalTimeout[j - 18] = 20;
    EEPROM.update(j, 20);
  }
  for (int j = 22; j < 28; j++) {
    analogTimeout[j - 30] = 40;
    EEPROM.update(j, 40);
  }
  for (int j = 28; j < 34; j++) {
    analogChangeMin[j - 36] = 30;
    EEPROM.update(j, 30);
  }
  Serial.println("MEMRESET");
}

String intArrayToString(int arr[], int size) {
  String output = "";
  for (int a = 0; a < size; a++) {
    output += String(arr[a]);
    if (a != (size - 1)) {
      output += ", ";
    }
  }
  return output;
}

void configureDigitalPin(int pin) {
  // 1 - Button to ground
  if (digitalConfig[pin] == 1) {
    pinMode(pin, INPUT_PULLUP);
    digitalLastState[pin] = (digitalRead(pin) == HIGH);
  }
  // 2 - IR Receivers are not configured by this function.
}

void configureAnalogPin(int pin) {
  // 1 - Button to ground
  if (analogConfig[pin - 10] == 1) {
    pinMode(pin, INPUT_PULLUP);
    analogLastState[pin - 10] = (digitalRead(pin) == HIGH);
  }
  if (analogConfig[pin - 10] == 2){
    //IRrecv irrecv(pin);
  }
}

void handleSerialCommands() {
  while (Serial.available() > 0) {
    char serialChar = Serial.read();
    if (serialChar == '\n') {
      // Digital Pin Functions
      if (serialBuffer.substring(0, 5) == "DPIN ") {
        // Set digital pin config
        if (serialBuffer.substring(5, 7) == "S ") {
          // Usage - "DPIN S <PIN (two digits)> <MODE>"
          int pin = serialBuffer.substring(7, 9).toInt();
          int mode = serialBuffer.substring(10).toInt();
          if (pin < 0 || pin > 7) {
            Serial.println("Malfored command. Invalid pin.");
          } else {
            digitalConfig[pin] = mode;
            EEPROM.update(pin, mode);
            configureDigitalPin(pin);
            Serial.println("DIGITAL PIN " + String(pin) + " IS NOW MODE " + String(mode));
            if (mode == 2){
                IRpin = pin;
                Serial.println("Changing the IR receiver port requires a device restart. Please wait.");
                delay(3000);
                System.reset();
            }
          }
        } else if (serialBuffer.substring(5, 7) == "T ") {
          int pin = serialBuffer.substring(7, 9).toInt();
          int time = serialBuffer.substring(10).toInt();
          if (pin < 0 || pin > 7) {
            Serial.println("Malfored command. Invalid pin.");
          } else if (time > 255) {
            Serial.println("Malformed command. Time above max (255).");
          } else {
            digitalTimeout[pin - 2] = time;
            EEPROM.update(pin + 16, time);
            Serial.println("DIGITAL PIN " + String(pin) + " NOW HAS TIMEOUT OF " + String(time));
          }
        }
      } else if (serialBuffer.substring(0, 5) == "APIN ") {
        if (serialBuffer.substring(5, 7) == "S ") {
          // Usage - "APIN S <PIN (two digit)> <MODE>"
          int pin = serialBuffer.substring(7, 9).toInt();
          int mode = serialBuffer.substring(10).toInt();
          if (pin < 10 || pin > 15) {
            Serial.println("Malfored command. Invalid pin.");
          } else {
            analogConfig[pin - 10] = mode;
            EEPROM.update(pin - 2, mode);
            configureAnalogPin(pin);
            Serial.println("ANALOG PIN " + String(pin) + " IS NOW MODE " + String(mode));
          }
        } else if (serialBuffer.substring(5, 7) == "T ") {
          int pin = serialBuffer.substring(7, 9).toInt();
          int time = serialBuffer.substring(10).toInt();
          if (pin < 10 || pin > 15) {
            Serial.println("Malfored command. Invalid pin.");
          } else if (time > 255) {
            Serial.println("Malformed command. Time above max (255).");
          } else {
            analogTimeout[pin - 10] = time;
            EEPROM.update(pin + 12, time);
            Serial.println("ANALOG PIN " + String(pin) + " NOW HAS TIMEOUT OF " + String(time));
          }
        } else if (serialBuffer.substring(5, 7) == "V ") {
          int pin = serialBuffer.substring(7, 9).toInt();
          int val = serialBuffer.substring(10).toInt();
          if (pin < 10 || pin > 15) {
            Serial.println("Malfored command. Invalid pin.");
          } else if (val > 255) {
            Serial.println("Malformed command. Change value above max (255).");
          } else {
            analogChangeMin[pin - 10] = val;
            EEPROM.update(pin + 18, val);
            Serial.println("ANALOG PIN " + String(pin) + " HAS VALUE CHANGE MINIMUM OF " + String(val));
          }
        }
      } else if (serialBuffer == "EEPROM") {
        loadEEPROM();
      } else if (serialBuffer == "CONFIGSTATE") {
        Serial.println(intArrayToString(digitalConfig, 8));
        Serial.println(intArrayToString(analogConfig, 6));
        Serial.println(intArrayToString(digitalTimeout, 8));
        Serial.println(intArrayToString(analogTimeout, 6));
        Serial.println(intArrayToString(analogChangeMin, 6));
      } else if (serialBuffer == "MEMRESET") {
        EEPROMReset();
      } else if (serialBuffer == "VERSION") {
        Serial.println(version);
      } else {
        Serial.println("Malformed command.");
      }
      serialBuffer = "";
    } else {
      serialBuffer.concat(serialChar);
    }
  }
}

void handleDigitalPin(int pin) {
  if (digitalConfig[pin] == 1) {
    bool state = (digitalRead(pin) == HIGH);
    if ((state != digitalLastState[pin]) && pastTimeoutDigital(pin)) {
      if (!state) {
        Serial.println("BUTTON " + String(pin) + " DOWN");
      } else {
        Serial.println("BUTTON " + String(pin) + " UP");
      }
      updateDigitalPinState(pin, state);
    }
  }
  if (digitalConfig[pin] == 2){
    if (irrecv.decode(&results)){
      Serial.println("IRGET " + String(pin) + " " + String(results.value, HEX));
      irrecv.resume();
    }
  }
}

void handleAnalogPin(int pin) {
  if (analogConfig[pin - 10] == 1) {
    bool state = (digitalRead(pin) == HIGH);
    if ((state != analogLastState[pin - 10]) && pastTimeoutAnalog(pin)) {
      if (!state) {
        Serial.println("BUTTON " + String(pin) + " DOWN");
      } else {
        Serial.println("BUTTON " + String(pin) + " UP");
      }
      updateAnalogPinState(pin, state);
    }
  }
  if (digitalConfig[pin - 10] == 2){
    if (irrecv.decode(&results)){
      Serial.println("IRGET " + String(pin) + " " + String(results.value, HEX));
      irrecv.resume();
    }
  }
  if (analogConfig[pin - 10] == 40) {
    // Check if past timeout first to prevent reading too fast
    if (pastTimeoutAnalog(pin)) {
      int state = analogRead(pin);
      if (minDifference(analogLastState[pin - 10], state, analogChangeMin[pin - 10])) {
        Serial.println("POTENT " + String(pin) + " " + String(state));
        updateAnalogPinState(pin, state);
      }
    }
  }
}

void updateDigitalPinState(int pin, bool state) {
  digitalLastStateChange[pin] = millis();
  digitalLastState[pin] = state;
}

void updateAnalogPinState(int pin, int state) {
  analogLastStateChange[pin - 10] = millis();
  analogLastState[pin - 10] = state;
}

bool pastTimeoutDigital(int pin) {
  long lastChange = digitalLastStateChange[pin];
  long time = millis();
  if (time < lastChange) {
    return true;
  } else if (time > (lastChange + digitalTimeout[pin])) {
    return true;
  }
  return false;
}

bool pastTimeoutAnalog(int pin) {
  long lastChange = analogLastStateChange[pin - 10];
  long time = millis();
  if (time < lastChange) {
    return true;
  } else if (time > (lastChange + analogTimeout[pin - 10])) {
    return true;
  }
  return false;
}

bool minDifference(int original, int newVal, int minimumDifference) {
  if (newVal >= (original + minimumDifference)) {
    return true;
  } else if (newVal <= (original - minimumDifference)) {
    return true;
  } else {
    return false;
  }
}
