var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  ten : String,
  alias : String,
  password : String,
  tuoi : { type: Number, min: 10, max: 65 },
  ngaysinh : String,
  thanhpho : String,
  truong : String,
  email : String,
  language : String
});
var user = mongoose.model("User", UserSchema, 'Social');
module.exports = user;
