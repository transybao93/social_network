var mongoose = require('mongoose');
var user = require('./user');
var post = require('./posts');
var Schema = mongoose.Schema;

var LikeSchema = new mongoose.Schema({
  userID : { type: Schema.Types.ObjectId, ref: user.User },
  postID : { type: Schema.Types.ObjectId, ref: post.Post },
});

//module.exports = mongoose.model("Post", PostSchema);
var likes = mongoose.model("Like", LikeSchema, 'Social');
module.exports = likes;
