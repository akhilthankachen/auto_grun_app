#include <ESP8266WiFi.h>
#include <DNSServer.h>            //Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     //Local WebServer used to serve the configuration portal
#include <WiFiManager.h>   
#include <MQTT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include <RTClib.h>
#include <EEPROM.h>
#include <Wire.h>
#include <FS.h>

// settings begin
/////////////////

// clock mode
bool rtcMode = false;

// rtc object
RTC_DS3231 rtc;

// channel settings array
int chOne[6][3];
int chTwo[6][3];
int chThree[6][3];
int chFour[6][3];
int chSizeOne;
int chSizeTwo;
int chSizeThree;
int chSizeFour;
int chOneUp;
int chOneLp;
int chTwoUp;
int chTwoLp;
int chThreeUp;
int chThreeLp;
int chThreeDuration;

// ssid
char ssid[100];
// password
char password[100];

// mqtt server address
char addr[20] = "142.93.216.218";

//channel pins
int channelOnePin = 15;
int channelTwoPin = 12;
int channelThreePin = 14;
int channelFourPin = 13;

// standlalone or connected mode
bool standalone = false;

// device id
String deviceId = "test123";

// GPIO where the DS18B20 is connected to
const int oneWireBus = 0;     

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

WiFiClient net;
WiFiManager wifiManager;
MQTTClient client(4096);

const long utcOffsetInSeconds = 19800; // 5.5 ( UTC +5 1/2 ) *60*60
// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

unsigned long lastMillis = 0;

// settings end
//
//
// mqtt block begin

void storeSettings( char* json ){
  Serial.println("Saving settings to eeprom .. ");
  
  uint addr = 0;

  // fake data
  struct { 
    uint val = 0;
    char str[500] = "";
  } data;

  strncpy( data.str, json, 500 );

  EEPROM.begin(512);
  EEPROM.put(addr,data);
  EEPROM.commit();
  EEPROM.end();

  data.val = 0; 
  strncpy(data.str,"",500);
  
}

void loadSettings(){
  Serial.println("Loading settings from eeprom ..");

  uint addr = 0;

  // fake data
  struct { 
    uint val = 0;
    char str[500] = "";
  } data;

  EEPROM.begin(512);

  EEPROM.get(addr,data);

  EEPROM.end();

  handleSettings( data.str );

  data.val = 0; 
  strncpy(data.str,"",500);
}

void storeSettingsSPIFFS( char *str){
  Serial.println( "Storing settings to spiffs...");
  File f;
  f = SPIFFS.open("/settings.txt", "w");
  if( !f ){
    Serial.println("Settings file open for write failed!!!");
  }else{
    int bytesWritten = f.print(str);

    if (bytesWritten == 0){
      Serial.println("Settings file write failed");
    }
  }
  f.close();
}

String loadSettingsSPIFFS(){
  Serial.println( "Loading settings from spiffs" );
  File f;
  String settings;
  if( SPIFFS.exists("/settings.txt") ){
    f = SPIFFS.open("/settings.txt", "r");
    if( f && f.size() ){
      while( f.available() ){
        settings += char(f.read());
      }
    }else{
      settings = "{}";
    }
  }else{
    settings = "{}";
  }

  f.close();
  return settings;
}

void handleSettings( char* json ){
  Serial.println(json);
  //converting json
  Serial.println("handling json");
  const size_t capacity = 2*JSON_OBJECT_SIZE(2) + 2*JSON_OBJECT_SIZE(3) + 60;
  DynamicJsonDocument doc(capacity);

  deserializeJson(doc, json);
  chOneUp = doc["ch1"]["up"]; 
  chOneLp = doc["ch1"]["lp"]; 
  chTwoUp = doc["ch2"]["up"]; 
  chTwoLp = doc["ch2"]["lp"]; 
  chThreeUp = doc["ch3"]["up"]; 
  chThreeLp = doc["ch3"]["lp"]; 
  chThreeDuration = doc["ch3"]["d"];

  
  //JsonArray ch1 = doc["ch1"];
  //JsonArray ch2 = doc["ch2"];
  //JsonArray ch3 = doc["ch3"];
  //JsonArray ch4 = doc["ch4"];  
  //chSizeOne = ch1.size();
  //chSizeTwo = ch2.size();
  //chSizeThree = ch3.size();
  //chSizeFour = ch4.size();
  
  //if(chSizeOne != 0){
    //for( int i=0; i<chSizeOne; i++){
      //JsonObject tmp = ch1[i];
      //chOne[i][0] = tmp["h"];
      //chOne[i][1] = tmp["m"];
      //chOne[i][2] = tmp["d"];
    //}
  //}
  //if(chSizeTwo != 0){
    //for( int i=0; i<chSizeTwo; i++){
      //JsonObject tmp = ch2[i];
      //chTwo[i][0] = tmp["h"];
      //chTwo[i][1] = tmp["m"];
      //chTwo[i][2] = tmp["d"];
    //}
  //}
  //if(chSizeThree != 0){
    //for( int i=0; i<chSizeThree; i++){
      //JsonObject tmp = ch3[i];
      //chThree[i][0] = tmp["h"];
      //chThree[i][1] = tmp["m"];
      //chThree[i][2] = tmp["d"];
    //}
  //}
  //if(chSizeFour != 0){
    //for( int i=0; i<chSizeFour; i++){
      //JsonObject tmp = ch4[i];
      //chFour[i][0] = tmp["h"];
      //chFour[i][1] = tmp["m"];
      //chFour[i][2] = tmp["d"];
    //}
  //}

}

void connect() {
  if( WiFi.status() != WL_CONNECTED ){
    return;  
  }

  Serial.print("\nconnecting...");
  int i = 0;

  char deviceIdChar[deviceId.length() + 1];
  deviceId.toCharArray(deviceIdChar, deviceId.length() + 1);
  client.connect( deviceIdChar , "cowfarm", "cowfarm");

  if(!client.connected()){
    return;
  }

  Serial.println("\nconnected!");

  client.subscribe("settings/" + deviceId);
  client.subscribe("ping/" + deviceId);
  // client.unsubscribe("/hello");
}

void messageReceived(String &topic, String &payload) {
  if(topic == "settings/" + deviceId){
    char charBuff[payload.length() +1];
    payload.toCharArray(charBuff, payload.length() + 1);
    //storeSettings( charBuff );
    storeSettingsSPIFFS( charBuff );
    handleSettings( charBuff );
    client.publish("settingsAck", deviceId);
  }
  if(topic == "ping/" + deviceId){
    client.publish("pingAck", deviceId);
    Serial.println("ping");
  }
}

// mqtt block end

float tempSum = 0;
float tempMax = 0;
float tempMin = 0;
int tempCounter = 0;
int lastHour = -1;

void tempInHour(float temp, int currentHour){
   if(lastHour == currentHour){
    
    //for calculating average
    tempSum = tempSum + temp;
    tempCounter++;
    //calculating max and min
    if( tempMax <= temp ){
      tempMax = temp;
     }
    if( tempMin >= temp ){
      tempMin = temp;
     }
     
   }else{
     if( lastHour != -1 ){
      Serial.println("Average min max published");
      client.publish("tempAverage", deviceId + " " + String(tempSum/tempCounter));
      client.publish("tempMax", deviceId + " " + String(tempMax));
      client.publish("tempMin", deviceId + " " + String(tempMin));
      }
     lastHour = currentHour;
     tempMax = temp;
     tempMin = temp;
     tempSum = temp;
     tempCounter = 1;
   }
}

void syncNtpRtc(){
  Serial.println('syncing ntp rtc');
  timeClient.update();

  long actualTime = timeClient.getEpochTime();
  rtc.adjust(DateTime(actualTime));  
}

int initialMinutes = 0;
int initialHours = 0;
int initialSeconds = 0;
int currentMinute = 0;

void initMinutes(){
  if( rtcMode ){
    DateTime instance = rtc.now();
    initialMinutes = instance.minute();
    initialHours = instance.hour();
    initialSeconds = instance.second();
    currentMinute = instance.minute();
  }else{
    if( !standalone ){
      timeClient.update();
      initialMinutes = timeClient.getMinutes();
      initialHours = timeClient.getHours();
      initialSeconds = timeClient.getSeconds();
      currentMinute = timeClient.getMinutes();
    }
  }
}

void getStoredSSID(){
  Serial.println("Getting stored ssid");
  String tempSSID = wifiManager.getSSID();
  tempSSID.toCharArray(ssid, tempSSID.length() + 1);
}

void getStoredPassword(){
  Serial.println("Getting stored password");
  String tempPassword = wifiManager.getPassword();
  tempPassword.toCharArray(password, tempPassword.length() + 1);
}

void getNewSSID(){
  Serial.println("Getting new ssid");
  String tempSSID = WiFi.SSID();
  tempSSID.toCharArray(ssid, tempSSID.length() + 1);
  Serial.println(tempSSID);
}

void getNewPassword(){
  Serial.println("Getting new password");
  String tempPassword = WiFi.psk();
  tempPassword.toCharArray(password, tempPassword.length() + 1);
  Serial.println(tempPassword);
}

void setup() {
  Serial.begin(9600);
  Wire.begin( 4, 5 );
  SPIFFS.begin();

  getStoredSSID();
  getStoredPassword();
  
  wifiManager.setTimeout(60);
  
  client.begin(addr, net);
  client.onMessage(messageReceived);
  
  if(!wifiManager.autoConnect("AutoConnectAP")) {
    Serial.println("failed to connect and hit timeout");
    standalone = true;
    WiFi.disconnect(true);
  }else{
    // Note: Local domain names (e.g. "Computer.local" on OSX) are not supported by Arduino.
    // You need to set the IP address directly.

   getNewSSID(); 
   getNewPassword();
   timeClient.begin(); 
   connect();

  }

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    rtcMode = false;
    if(!standalone){
      Serial.println("Getting time with ntp ..");
    }
  }else{
    if(!standalone){
      syncNtpRtc();
    }
    rtcMode = true;
    Serial.println("Getting time with rtc ..");
  }

  pinMode(channelOnePin, OUTPUT);
  pinMode(channelTwoPin, OUTPUT);
  pinMode(channelThreePin, OUTPUT);
  pinMode(channelFourPin, OUTPUT);
  digitalWrite(channelOnePin, LOW);
  digitalWrite(channelTwoPin, LOW);  
  digitalWrite(channelThreePin, LOW);
  digitalWrite(channelFourPin, LOW);

  //loadSettings();
  String payload = loadSettingsSPIFFS();
  char charBuff[payload.length() +1];
  payload.toCharArray(charBuff, payload.length() + 1); 
  handleSettings( charBuff );
  initMinutes();
}

bool chActiveOne = false;
int chActiveOneEstimation = 0;
int chOneMillis = 0;

void executeTimerChOne( int hours, int minutes ){
  if( chActiveOne ){
    if( (millis() - chOneMillis)/1000 >= chActiveOneEstimation ){
      chActiveOne = false;
      chActiveOneEstimation = 0;
      Serial.println("switching off digital pin channel 1" );
      digitalWrite(channelOnePin, LOW);
    }
  }else{
    if( chSizeOne != 0 ){
      for( int i = 0 ; i<chSizeOne ; i++ ){
        if( hours == chOne[i][0] && minutes == chOne[i][1] ){
          chActiveOne = true;
          chOneMillis = millis();
          chActiveOneEstimation = chOne[i][2];              
          Serial.println("switching on digital pin channel 1" );
          digitalWrite(channelOnePin, HIGH);
        }
      }
    }
  }
}

bool chActiveTwo = false;
int chActiveTwoEstimation = 0;
int chTwoMillis = 0;

void executeTimerChTwo( int hours, int minutes ){
  if( chActiveTwo ){
    if( (millis() - chTwoMillis)/1000 >= chActiveTwoEstimation ){
      chActiveTwo = false;
      chActiveTwoEstimation = 0;
      Serial.println("switching off digital pin channel 2" );
      digitalWrite(channelTwoPin, LOW);
    }
  }else{
    if( chSizeTwo != 0 ){
      for( int i = 0 ; i<chSizeTwo ; i++ ){
        if( hours == chTwo[i][0] && minutes == chTwo[i][1]){
          chActiveTwo = true;
          chTwoMillis = millis();
          chActiveTwoEstimation = chTwo[i][2];              
          Serial.println("switching on digital pin channel 2" );
          digitalWrite(channelTwoPin, HIGH);
        }
      }
    }
  }
}

bool chActiveThree = false;
int chActiveThreeEstimation = 0;
int chThreeMillis = 0;

void executeTimerChThree( int hours, int minutes ){
  if( chActiveThree ){
    if( (millis() - chThreeMillis)/1000 >= chActiveThreeEstimation ){
      chActiveThree = false;
      chActiveThreeEstimation = 0;
      Serial.println("switching off digital pin channel 3" );
      digitalWrite(channelThreePin, LOW);
    }
  }else{
    if( chSizeThree != 0 ){
      for( int i = 0 ; i<chSizeThree ; i++ ){
        if( hours == chThree[i][0] && minutes == chThree[i][1]){
          chActiveThree = true;
          chThreeMillis = millis();
          chActiveThreeEstimation = chThree[i][2];              
          Serial.println("switching on digital pin channel 3" );
          digitalWrite(channelThreePin, HIGH);
        }
      }
    }
  }
}

bool chActiveFour = false;
int chActiveFourEstimation = 0;
int chFourMillis = 0;

void executeTimerChFour( int hours, int minutes ){
  if( chActiveFour ){
    if( (millis() - chFourMillis)/1000 >= chActiveFourEstimation ){
      chActiveFour = false;
      chActiveFourEstimation = 0;
      Serial.println("switching off digital pin channel 4" );
      digitalWrite(channelFourPin, LOW);
    }
  }else{
    if( chSizeFour != 0 ){
      for( int i = 0 ; i<chSizeFour ; i++ ){
        if( hours == chFour[i][0] && minutes == chFour[i][1]){
          chActiveFour = true;
          chFourMillis = millis();
          chActiveFourEstimation = chFour[i][2];              
          Serial.println("switching on digital pin channel 4" );
          digitalWrite(channelFourPin, HIGH);
        }
      }
    }
  }
}

void automateChOne( int temp ){
  if( chOneUp != 0 && chOneLp != 0 ){
     if( digitalRead( channelOnePin ) == 0 ){
      if( temp > chOneUp ){
        digitalWrite( channelOnePin, HIGH );
        Serial.println( "Channel One On" );
      }
     }else if( digitalRead( channelOnePin ) == 1 ){
      if( temp <= chOneLp ){
        digitalWrite( channelOnePin, LOW );
        Serial.println( "Channel One off" );
      }
     }
  }
}

void automateChTwo( int temp ){
  if( chTwoUp != 0 && chTwoLp != 0 ){
     if( digitalRead( channelTwoPin ) == 0 ){
      if( temp > chTwoUp ){
        digitalWrite( channelTwoPin, HIGH );
        Serial.println( "Channel Two On" );
      }
     }else if( digitalRead( channelTwoPin ) == 1 ){
      if( temp <= chTwoLp ){
        digitalWrite( channelTwoPin, LOW );
        Serial.println( "Channel Two off" );
      }
     }
  }
}

int secondsCountThree = 0;
int secondsCountFour = chThreeDuration;
void automateChThree( int minutes, int seconds, int temp){
  if( chThreeUp != 0 && chThreeLp != 0 && chThreeDuration != 0){
    if( currentMinute != minutes){
      currentMinute = minutes;
      if( digitalRead( channelThreePin ) == 0 ){
        if( chThreeUp < temp ){
         if( secondsCountFour  >= chThreeDuration ){
           digitalWrite( channelThreePin, HIGH );
           Serial.println( "Switching on channel three" );
           secondsCountThree = 0;
         }
        }
        if( chThreeLp >= temp ){
          if (secondsCountThree >= chThreeDuration ){
            if( digitalRead( channelFourPin ) == 0 ){
              digitalWrite( channelFourPin, HIGH );
              Serial.println( "Switching on channel four" );
              secondsCountFour = 0;
            }
          }
        }
      }
    }

    if( digitalRead( channelThreePin ) == 1 ) {
      secondsCountThree++;
      if( secondsCountThree >= chThreeDuration ){
        digitalWrite( channelThreePin, LOW );
        Serial.println( "Switching off channel three" );
      }
    }

    if( digitalRead( channelFourPin ) == 1 ){
      secondsCountFour++;
      if( secondsCountFour >= chThreeDuration ){
        digitalWrite( channelFourPin, LOW );
        Serial.println( "Switching off channel four" );
      }
    }
  }
}

int initHours = -1;
void wifiReconnect(int hours){
  if( initHours != hours ){
    Serial.println("Trying to reconnect");
    initHours = hours;
    WiFi.begin(ssid, password);
    if( WiFi.status() != WL_CONNECTED ){
      standalone = true;
    }else{
      standalone = false;
      initHours = -1;
    }
  }
}

int hours = 0;
int minutes = 0;
int seconds = 0;

void loop() {
  if(standalone == false){
    client.loop();
    if (!client.connected()) {
      if (WiFi.status() != WL_CONNECTED){
        Serial.println("Wifi gone");
        standalone = true;
        WiFi.disconnect(true);
      }else{
        connect();
      }
    }
  }

  if( rtcMode ){
    DateTime instance = rtc.now();
    hours = instance.hour();
    minutes = instance.minute();
    seconds = instance.second();
  }else{
    if( !standalone ){
      timeClient.update();
      hours = timeClient.getHours();
      minutes = timeClient.getMinutes();
      seconds = timeClient.getSeconds();
    }
  }

  delay(10);  // <- fixes some issues with WiFi stability
  // publish a message roughly one minute.
  if (initialMinutes!=minutes) {
    initialMinutes = minutes;
    sensors.requestTemperatures(); 
    int temperatureC = sensors.getTempCByIndex(0);
    
    Serial.println("tick");

    if(temperatureC != 85 && temperatureC != -127){
      //error safe block
       tempInHour( temperatureC , hours );
       automateChOne( temperatureC );
       automateChTwo( temperatureC );
    }
    Serial.println(String(temperatureC));
  }

  if ( initialHours != hours ){
    initialHours = hours;
    sensors.requestTemperatures(); 
    int temperatureCH = sensors.getTempCByIndex(0);
    Serial.println("H tick");
    if(temperatureCH != 85 && temperatureCH != -127){
     client.publish("temp", deviceId + " " + String(temperatureCH));
    }
  }

  if ( initialSeconds != seconds ){
    initialSeconds = seconds;
    sensors.requestTemperatures(); 
    int temperatureCS = sensors.getTempCByIndex(0);
    if(temperatureCS != 85 && temperatureCS != -127){
     automateChThree( minutes, seconds, temperatureCS );
    }
  }

  // check and execute timers
  //executeTimerChOne( hours, minutes );
  //executeTimerChTwo( hours, minutes );
  //executeTimerChThree( hours, minutes );
  //executeTimerChFour( hours, minutes );


  if( standalone == true ){
    if( WiFi.status() != WL_CONNECTED ){
      wifiReconnect( minutes );
    }else{
      Serial.println("Wifi connected");
      standalone = false;
      initHours = -1;
    }
  }
}
