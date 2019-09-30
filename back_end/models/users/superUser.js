const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');

const superUser = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        default: 'root'
    },
    password: {
        type: String,
        required: true,
        default: 'root'
    },
    clusterId: {
        type: String,
        required: true,
        default: ''
    }
});

module.exports.superUser = mongoose.model('superUser', superUser);

module.exports.getUserById = function (id,callback){
    superUser.findById(id,callback);
  };
  
  module.exports.getUserByUsername = function (username,callback){
    const query = {username: username};
    superUser.findOne(query,callback);
  };
  
  module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err,hash) => {
        if(err){
          return console.log('error occured');
        }
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  };
  
  module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err){
        throw err;
      }
      callback(null, isMatch);
    });
  }

