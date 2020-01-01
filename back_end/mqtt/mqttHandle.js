var mqtt = require('mqtt')
const Device = require('../models/device/Device')
const DeviceTemp = require('../models/device/deviceTemp')

const ip = 'mqtt://localhost:1883';
module.exports = client  = mqtt.connect(ip)

//{
//   username: config.username,
//   password: config.password
//}

pingAckRouter = (message) => {
    message = message.toString().split(" ");
    const mac = message[0] ? message[0] : "0";
    const route = 'pingResponse/' + mac;
    console.log("ping ack from device " + mac)

    Device.findOne({mac:mac},(err,doc) => {
        if(err){
            console.log(err);
            client.publish(route, 'Failure');
        } else {
            client.publish(route, 'Success')
            doc.ping = true
            doc.save((err) => {
                if(err) console.log(err);
                console.log('ack saved')
            })
        }
    })    
}

settingsAckRouter = (message) => {
    message = message.toString().split(" ");
    const mac = message[0] ? message[0] : "0";
    const route = 'settingsResponse/' + mac;
    console.log("settings ack from device " + mac)

    Device.findOne({mac:mac},(err,doc) => {
        if(err){
            console.log(err);
            client.publish(route, 'Failure');
        } else {
            client.publish(route, 'Success')
            console.log(doc);
            doc.ack = true
            doc.save((err) => {
                if(err) console.log(err);
                console.log('ack saved')
            })
        }
    })    
}

tempRouter = (client, message) => {
    message = message.toString().split(" ");
    const mac = message[0] ? message[0] : "0";
    const temp = (message[1]) ? parseFloat(message[1]) : false;
    const route = 'tempResponse/' + mac;

    Device.findOne({mac:mac},(err,doc) => {
        if(err){
            console.log(err);
            client.publish(route, 'Failure',(err) => {
                if(err) console.log(err);
            });
        } else if (!doc) {
            console.log("Mac not found");
            client.publish(route, 'Failure',(err) => {
                if(err) console.log(err);
            });
        } else {
            if(typeof(temp) == 'number'){
                let data = {
                    mac : mac,
                    temp : temp
                }
            
                DeviceTemp.create(data,(err) => {
                    if (err) { throw err };
                });
                console.log(message);
                client.publish(route ,'success',(err) => {
                    if (err) console.log(err);
                });
            } else {
                client.publish(route, 'Failure',(err) => {
                if(err) console.log(err);
            })
        }
        }
    })    
}

client.on('connect', function () {
    client.subscribe('temp')
    client.subscribe('settingsAck')
})

client.on('message', function (topic, message) {
    switch(topic){
        case 'temp': {
            tempRouter(client, message);
            break;
        }
        case 'settingsAck': {
            settingsAckRouter(message);
            break;
        }
        case 'pingAck': {
            pingAckRouter(message);
            break;
        }
    } 
})

module.exports.publishCustom = (topic, message) => {
    client.publish(topic, message)
}





