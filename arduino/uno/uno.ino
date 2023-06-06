#include <EEPROM.h>

// Digital Pins 2-13 Setup
/*
  0 - Empty
  1 - Button
*/

int digitalConfig[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

// Analog Pins A0-A5 Setup
/*
  0 - Empty
*/

int analogConfig[] = {0, 0, 0, 0, 0, 0};

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
  }
  Serial.println(intArrayToString(analogConfig, 6));
}

void loop() {
  // put your main code here, to run repeatedly:

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