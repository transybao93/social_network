var mongoose = require('mongoose');
var user = require('./user');
var post = require('./posts');

var CommentSchema = new mongoose.Schema({
  userID : { type: Schema.Types.ObjectId, ref: user.User },
  noidung : String,
  ngaypost : { type: Date, default: Date.now },
  postID : { type: Schema.Types.ObjectId, ref: post.Post },
});

//module.exports = mongoose.model("Post", PostSchema);
var comments = mongoose.model("Comment", CommentSchema, 'Social');
module.exports = comments;
