const CowFarm = require('../models/cowfarm/CowFarm')
// mqtt client

var mqtt = require('mqtt')
module.exports = client  = mqtt.connect('mqtt://192.168.2.100', {
    username: 'cowfarm',
    password: 'cowfarm'
})

client.on('connect', function () {
    client.subscribe('/cowfarm1/temp')
})

client.on('message', function (topic, message) {
    if(topic == '/cowfarm1/temp'){
        let cow = new CowFarm({
            deviceName: 'cowfarm1',
            messageType: 'temp',
            message: message.toString()
        })

        cow.save(function(){
            console.log('saved'+Date.now() +' '+message)
        })
    }   
})

