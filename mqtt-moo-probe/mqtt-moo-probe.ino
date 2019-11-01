#include <ESP8266WiFi.h>
#include <DNSServer.h>            //Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     //Local WebServer used to serve the configuration portal
#include <WiFiManager.h>   
#include <MQTT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;     

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

WiFiClient net;
MQTTClient client;

const long utcOffsetInSeconds = 19800; // 5.5 ( UTC +5 1/2 ) *60*60
// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

unsigned long lastMillis = 0;

void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");
  while (!client.connect("esp8266", "cowfarm", "cowfarm")) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nconnected!");

  client.subscribe("light");
  // client.unsubscribe("/hello");
}

void messageReceived(String &topic, String &payload) {
  if(topic == "light"){
    if(payload == "1"){
      digitalWrite(LED_BUILTIN, HIGH);
    }else{
      digitalWrite(LED_BUILTIN, LOW);  
    }
  }
}

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
      client.publish("/cowfarm1/tempAverage", String(tempSum/tempCounter));
      client.publish("/cowfarm1/tempMax", String(tempMax));
      client.publish("/cowfarm1/tempMin", String(tempMin));
      }
     lastHour = currentHour;
     tempMax = temp;
     tempMin = temp;
     tempSum = temp;
     tempCounter = 1;
   }
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  WiFiManager wifiManager;
  wifiManager.autoConnect("AutoConnectAP");
  Serial.println("connected...yeey :)");


  // Note: Local domain names (e.g. "Computer.local" on OSX) are not supported by Arduino.
  // You need to set the IP address directly.
  client.begin("165.22.208.118", net);
  client.onMessage(messageReceived);

  connect();
  timeClient.begin();

}


void loop() {
  client.loop();
  delay(10);  // <- fixes some issues with WiFi stability
  timeClient.update();

  if (!client.connected()) {
    connect();
  }

  // publish a message roughly one minute.
  if (millis() - lastMillis > 60000) {
    lastMillis = millis();
    sensors.requestTemperatures(); 
    float temperatureC = sensors.getTempCByIndex(0);
    tempInHour( temperatureC , timeClient.getHours() );
    Serial.println("tick");

    client.publish("/cowfarm1/temp", String(temperatureC));
  }
}
