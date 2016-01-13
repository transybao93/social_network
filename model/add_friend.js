var mongoose = require('mongoose');
var user = require('./user');
var Schema = mongoose.Schema;

var NFSchema = new mongoose.Schema({
  userID : { type: Schema.Types.ObjectId, ref: user.User },
  friendID : { type: Schema.Types.ObjectId, ref: user.User },
});

//module.exports = mongoose.model("Post", PostSchema);
var addFr = mongoose.model("NewFriend", NFSchema, 'Social');
module.exports = addFr;
