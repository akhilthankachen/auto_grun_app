var mqtt = require('mqtt')
const Device = require('../models/device/Device')
const DeviceTemp = require('../models/device/deviceTemp')
const DeviceAvgTemp = require('../models/device/DeviceAvgTemp')
const DeviceMaxTemp = require('../models/device/DeviceMaxTemp')
const DeviceMinTemp = require('../models/device/DeviceMinTemp')

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

tempRouter = (message) => {
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

tempAvgRouter = (message) => {
    message = message.toString().split(" ");
    const mac = message[0] ? message[0] : "0";
    const temp = (message[1]) ? parseFloat(message[1]) : false;
    const route = 'tempAvgResponse/' + mac;

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
            
                DeviceAvgTemp.create(data,(err) => {
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

tempMaxRouter = (message) => {
    message = message.toString().split(" ");
    const mac = message[0] ? message[0] : "0";
    const temp = (message[1]) ? parseFloat(message[1]) : false;
    const route = 'tempMaxResponse/' + mac;

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
            
                DeviceMaxTemp.create(data,(err) => {
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

tempMinRouter = (message) => {
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
            
                DeviceMinTemp.create(data,(err) => {
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
    client.subscribe('tempAverage')
    client.subscribe('tempMax')
    client.subscribe('tempMin')
    client.subscribe('settingsAck')
    client.subscribe('pingAck')
})

client.on('message', function (topic, message) {
    switch(topic){
        case 'temp': {
            tempRouter(message)
            break
        }
        case 'tempAverage': {
            tempAvgRouter(message)
            break
        }
        case 'tempMax': {
            tempMaxRouter(message)
            break
        }
        case 'tempMin': {
            tempMinRouter(message)
            break
        }
        case 'settingsAck': {
            settingsAckRouter(message)
            break
        }
        case 'pingAck': {
            pingAckRouter(message)
            break
        }
    } 
})

module.exports.publishCustom = (topic, message) => {
    client.publish(topic, message)
}





