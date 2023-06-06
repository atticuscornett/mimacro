#include <EEPROM.h>

// Digital Pins 2-13 Setup
/*
  0 - Empty
  1 - Button
*/

int digitalConfig[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
int digitalTimeout[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
bool digitalLastState[] = {false, false, false, false, false, false, false, false, false, false, false, false};

// Analog Pins A0-A5 Setup
/*
  0 - Empty
  1 - Button
*/

int analogConfig[] = {0, 0, 0, 0, 0, 0};
int analogTimeout[] = {0, 0, 0, 0, 0, 0};
int analogLastState[] = {0, 0, 0, 0, 0, 0};
int analogChangeMin[] = {0, 0, 0, 0, 0, 0};

String serialBuffer = "";

void setup() {
  Serial.begin(9600);
  Serial.println("Arduino Macros");
  Serial.println("UNO 0.0.1");

  int read;
  // Load button config from EEPROM
  for (int i = 0; i < 12; i++){
    read = EEPROM.read(i);
    // Check validity
    if (read > 1){
      // Memory is invalid, reset memory;
      for (int j = 0; j < 12; j++){
        digitalConfig[j] = 0;
        EEPROM.update(j, 0);
      }
      Serial.println("MEMRESET");
      break;
    }
    digitalConfig[i] = read;
    // Configure digital pins (2-13)
    configureDigitalPin(i+2);
  }

  Serial.println(intArrayToString(digitalConfig, 12));
  
  for (int i = 12; i < 18; i++){
    read = EEPROM.read(i);
    // Check validity
    if (read > 1){
      // Memory is invalid, reset memory;
      for (int j = 12; j < 18; j++){
        analogConfig[j] = 0;
        EEPROM.update(j, 0);
      }
      Serial.println("MEMRESET");
      break;
    }
    analogConfig[i] = read;
    // Configure analog pins (14-19/A0-A5)
    configureAnalogPin(i+2);
  }
  Serial.println(intArrayToString(analogConfig, 6));
}

void loop() {
  handleSerialCommands();
}

String intArrayToString(int arr[], int size) {
  String output = "";
  for (int a = 0; a < size; a++){
    output += String(arr[a]);
    if (a != (size - 1)){
      output += ", ";
    }
  }
  return output;
}

void configureDigitalPin(int pin){
  // 1 - Button to ground
  if (digitalConfig[pin-2] == 1){
    pinMode(pin, INPUT_PULLUP);
  }
}

void configureAnalogPin(int pin){
  // 1 - Button to ground
  if (analogConfig[pin-14] == 1){
    pinMode(pin, INPUT_PULLUP);
  }
}

void handleSerialCommands(){
  while (Serial.available() > 0){
    char serialChar = Serial.read();
    if (serialChar == '\n'){
      // Digital Pin Functions
      if (serialBuffer.substring(0, 5) == "DPIN "){
        // Set digital pin config
        if (serialBuffer.substring(5, 7)  == "S "){
          // Usage - "DPIN S <PIN (two digits)> <MODE (two digits)>"
          int pin = serialBuffer.substring(7, 9).toInt();
          int mode = serialBuffer.substring(10, 12).toInt();
          if (pin < 2 || pin > 13){
            Serial.println("Malfored command. Invalid pin.");
          }
          else{
            digitalConfig[pin-2] = mode;
            EEPROM.update(pin-2, mode);
            configureDigitalPin(pin);
            Serial.println("DIGITAL PIN " + String(pin) + " IS NOW MODE " + String(mode));
          }
        }
      }
      else{
        Serial.println("Malformed command.");
      }
      Serial.println(serialBuffer);
      serialBuffer = "";
    }
    else{
      serialBuffer.concat(serialChar);
    }
  }
}