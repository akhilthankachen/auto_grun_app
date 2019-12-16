const CowFarm = require('../models/cowfarm/CowFarm')
const config = require('../config/mqtt')
// mqtt client

var mqtt = require('mqtt')
module.exports = client  = mqtt.connect(config.remote)

//{
//   username: config.username,
//   password: config.password
//}

client.on('connect', function () {
    console.log('mqtt connected')
    client.subscribe('/cowfarm1/temp')
    client.subscribe('/cowfarm1/settings')
})

client.on('message', function (topic, message) {
    if(topic == '/cowfarm1/temp'){
        let cow = new CowFarm({
            deviceName: 'cowfarm1',
            messageType: 'temp',
            message: message.toString()
        })

        cow.save(function(){
            console.log('saved '+Date.now() +' '+message)
        })
    }   
})

module.exports.publish = (topic, message) => {
    client.publish(topic, message)
}

