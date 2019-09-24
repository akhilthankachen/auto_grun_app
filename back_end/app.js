const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database_config = require('./config/database');
const mode_config = require('./config/env');

// database connection

// express app initiation
const port = 3000;
var app = express();

// routes

// middleware declaration
app.use(cors()); // cors in use
app.use(bodyParser.json()); // body parser

// app loop
app.get('/', (req,res) => { // home '/' response
    res.send('working');
});
app.listen(port, () => {
    if(mode_config.mode == "dev"){
        console.log('server started at port ' + port);
    }
});