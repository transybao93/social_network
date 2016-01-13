var mongoose = require('mongoose');
var user = require('./user');
var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
  tieude : String,
  nguoiviet : { type: Schema.Types.ObjectId, ref: user.User },
  ngayviet : { type: Date, default: Date.now },
  noidung : String,
  type : String
});

//module.exports = mongoose.model("Post", PostSchema);
var posts = mongoose.model("Post", PostSchema, 'Social');
module.exports = posts;
