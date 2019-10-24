const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
var Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
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
        required: true,
        unique: true
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
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    enterprise: {
      type: String
    },
    gst: {
      type: String
    },
    registeredAddress: {
      type: String
    }
});

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = module.exports = mongoose.model('User', userSchema);


module.exports.getUserById = function (id,callback){
  User.findById(id,callback);
};

module.exports.getUserByUsername = function (username,callback){
  const query = {username: username};
  User.findOne(query,callback);
};

module.exports.getUserByEmail = function (email,callback){
  const query = {email: email};
  User.findOne(query,callback);
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


