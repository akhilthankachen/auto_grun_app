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

// settings begin
/////////////////

// clock mode
bool rtcMode = false;

// rtc object
RTC_DS3231 rtc;

// channel settings array
int chOne[5][3];
int chTwo[5][3];
int chSizeOne;
int chSizeTwo;

// ssid
char ssid[100];
// password
char password[100];

// mqtt server address
char addr[20] = "142.93.216.218";

//channel pins
int channelOnePin = 12;
int channelTwoPin = 0;

// standlalone or connected mode
bool standalone = false;

// device id
String deviceId = "test123";

// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;     

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

WiFiClient net;
WiFiManager wifiManager;
MQTTClient client(400);

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
    char str[400] = "";
  } data;

  strncpy( data.str, json, 400 );

  EEPROM.begin(512);
  EEPROM.put(addr,data);
  EEPROM.commit();
  EEPROM.end();

  data.val = 0; 
  strncpy(data.str,"",400);
  
}

void loadSettings(){
  Serial.println("Loading settings from eeprom ..");

  uint addr = 0;

  // fake data
  struct { 
    uint val = 0;
    char str[400] = "";
  } data;

  EEPROM.begin(512);

  EEPROM.get(addr,data);

  EEPROM.end();

  handleSettings( data.str );

  data.val = 0; 
  strncpy(data.str,"",400);
}

void handleSettings( char* json ){
  Serial.println(json);
  //converting json
  Serial.println("handling json");
  const size_t capacity = 2*JSON_ARRAY_SIZE(5) + JSON_OBJECT_SIZE(2) + 10*JSON_OBJECT_SIZE(3) + 110;
  DynamicJsonDocument doc(capacity);

  deserializeJson(doc, json);
  JsonArray ch1 = doc["ch1"];
  JsonArray ch2 = doc["ch2"];
  chSizeOne = ch1.size();
  chSizeTwo = ch2.size();
  
  if(chSizeOne != 0){
    for( int i=0; i<chSizeOne; i++){
      JsonObject tmp = ch1[i];
      chOne[i][0] = tmp["h"];
      chOne[i][1] = tmp["m"];
      chOne[i][2] = tmp["d"];
    }
  }
  if(chSizeTwo != 0){
    for( int i=0; i<chSizeTwo; i++){
      JsonObject tmp = ch2[i];
      chTwo[i][0] = tmp["h"];
      chTwo[i][1] = tmp["m"];
      chTwo[i][2] = tmp["d"];
    }
  }

}

void connect() {

  Serial.print("\nconnecting...");
  int i = 0;
  while (!client.connect( "esp8266" , "cowfarm", "cowfarm")) {
    Serial.print(".");
    delay(1000);
    i++;
    if(i == 10){
      break;
    }
  }

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
    storeSettings( charBuff );
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
int lastHour;

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
     if( lastHour != 0 ){
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

void initMinutes(){
  if( rtcMode ){
    DateTime instance = rtc.now();
    initialMinutes = instance.minute();
  }else{
    if( !standalone ){
      timeClient.update();
      initialMinutes = timeClient.getMinutes();
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
  Wire.begin( 14, 2 );

  getStoredSSID();
  getStoredPassword();
  
  wifiManager.setTimeout(180);
  
  client.begin(addr, net);
  client.onMessage(messageReceived);
  
  if(!wifiManager.autoConnect("AutoConnectAP")) {
    Serial.println("failed to connect and hit timeout");
    standalone = true;
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
  digitalWrite(channelOnePin, LOW);
  digitalWrite(channelTwoPin, LOW);

  loadSettings();
  initMinutes();
}

bool chActiveOne = false;
int chActiveOneEstimation = 0;

void executeTimerChOne( int hours, int minutes ){
  if( chActiveOne ){
    if( minutes == chActiveOneEstimation ){
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
          if( minutes + chOne[i][2] >= 60 ){
            chActiveOneEstimation = minutes + chOne[i][2] - 60;
          }else{
            chActiveOneEstimation = chOne[i][2] + minutes;              
          }
          Serial.println("switching on digital pin channel 1" );
          digitalWrite(channelOnePin, HIGH);
        }
      }
    }
  }
}

bool chActiveTwo = false;
int chActiveTwoEstimation = 0;

void executeTimerChTwo( int hours, int minutes ){
  if( chActiveTwo ){
    if( minutes == chActiveTwoEstimation ){
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
          if( minutes + chTwo[i][2] >= 60 ){
            chActiveTwoEstimation = minutes + chTwo[i][2] - 60;
          }else{
            chActiveTwoEstimation = chTwo[i][2] + minutes;              
          }
          Serial.println("switching on digital pin channel 2" );
          digitalWrite(channelTwoPin, HIGH);
        }
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
    delay(5000);
    if( WiFi.status() != WL_CONNECTED ){
      standalone = true;
      Serial.println("Reconnection failed");
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
    float temperatureC = sensors.getTempCByIndex(0);
    
    Serial.println("tick");

    if(temperatureC != 85 && temperatureC != -127){
       client.publish("temp", deviceId + " " + String(temperatureC));
       tempInHour( temperatureC , hours ); 
    }
    Serial.println(String(temperatureC));
  }

  // check and execute timers
  executeTimerChOne( hours, minutes );
  executeTimerChTwo( hours, minutes );
  if( standalone == true ){
    wifiReconnect( hours );
  }
}
