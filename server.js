var express = require("express"),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    var port = process.env.PORT || 8888;
var session = require('express-session');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
server.listen(port);

//create session using express
app.use(session({
  secret: 'WERTYUIASDFGHJKQWERTYUI234567890',
  resave: false,
  saveUninitialized: true
}));
//mongoose
var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');
mongoose.connect('mongodb://localhost:27017/Social');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Success !");
});

var user = require("./model/user");
var posts = require("./model/posts");
var like = require('./model/like');


app.set('view options', { self: true });
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//show data to index homepage
var p2 = new Object();
var l2 = new Object();
posts.find().populate('nguoiviet').exec(function(err, p) {
  if (err) console.log(err);
  //tìm kiếm trong bảng like
  like.find({},function(err,l){
    l2 = l;
  });
  p2 = p;
});



//login
//send data to homepage
app.get('/', function(req, res)
{
  sess = req.session;
  if(sess.email)
  {
    var u_email = sess.email;
    user.findOne({"email":u_email},'ten',function(err,u){
      if(err)console.log(err);
      res.render('index', {docs: p2, like:l2, uname:u.ten});
    });
  }else{
    res.render('login');
  }

    //res.render('index', {docs: p2, like:l2});
});

var sess;
app.post('/', function(req, res) {
  var email = req.body.email;
  var pass = req.body.pass;
  user.find({"email":email,"password":pass},function(err,u){
    if(err)console.log(err);
    if(u.length != 0)
    {
      sess = req.session;
      sess.email = req.body.email;
      res.end('ok');
    }else{
      res.end('not');
    }
  });
});
//homepage
app.get('/home', function(req, res) {
  sess = req.session;
  if(sess.email)
  {
    var u_email = sess.email;
    user.findOne({"email":u_email},'ten',function(err,u){
      if(err)console.log(err);
      res.render('index', {docs: p2, like:l2, uname:u.ten});
    });
  }else{
    res.render('login');
  }

});

//logout
app.get('/logout', function(req, res) {
  req.session.destroy(function(err){
    if(err)console.log(err);
    res.render('login');
  });
});

//redirect to Register
app.get('/register', function(req, res) {
  res.render('register');
});
//get data from login
app.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var pass = req.body.pass;
  //kiểm tra trùng rồi insert vào database
  user.find({"email":email},function(err,u){
    if(err)console.log(err);
    if(u.length == 0)
    {
      insert(name,email,pass);
      res.end('done');
    }else{
      res.end('exist');
    }
  });

});
//hàm insert
function insert(name, email, pass)
{
  var user1 = new user({
    ten : name,
    password : pass,
    email : email,
  });
  user1.save();
}

//redirect profile
app.get('/profile/:id', function(req, res) {
  var u_id = mongoose.Types.ObjectId(req.params.id);
  user.findById(u_id, function(err, u){
    if(err) console.log(err);
    res.render('profile', {user: u.toObject()});
  });

});

//redirect search
app.get('/search/:username', function(req, res) {
  var u_name = req.params.username;
  user.find({'ten' : new RegExp(u_name, "i")}, 'ten',function(err, u){
    if(err) console.log(err);
    res.render('search', {user: u});
  });
});

//when user like a page
app.get('/like', function(req, res) {

});
//socket io

// posts.find({}, function(err, docs){
//     if(err) throw console.log("Cannot send back to client !");
//     //res.render('index', { layout : 'index', docs: docs});
//
// });

// var myBox = new Object();
// posts.find({ 'type': 'loimoi' }, 'tieude nguoiviet ngayviet noidung', function (err, person) {
//   if (err) return handleError(err);
//   myBox = person;
// })



// var myBox = {
//   tieude : "tin nhắn",
//   nguoiviet : "Vân Anh",
//   noidung : "tin nhắn từ Vân Anh",
//   type: "tinnhan"
// };

// var r = new Object();
// posts.find({ 'type': 'baiviet' }, 'tieude nguoiviet ngayviet noidung', function (err, person) {
//   if (err) return handleError(err);
//   r = person;
//
// });


//find user by _id
// console.log('Find user by ID 2');
// //'5689531e3d6f647416f075b3'
var r = new Object();
posts.find().populate('nguoiviet').exec(function(err, p) {
  if (err) console.log(err);
  r = p;
});

//function to insert to like table
function insertToLikeTable(uid,pid){
  var new_like = new like({
    userID : uid,
    postID : pid
  });
  //save to database
  new_like.save();
  return true;
}


io.sockets.on('connection', function(socket){
  socket.on('chat message', function(msg){
    //console.log(msg);
    //socket.emit('new mess', {msg: msg, nick: '123'});
    io.sockets.emit('new mess', {post: r});
    //console.log('message: ' + msg);
  });

  socket.on('like', function(msg){
    var msg2 = msg.split("/");
    var uid = mongoose.Types.ObjectId(msg2[0]);
    var pid = mongoose.Types.ObjectId(msg2[1]);
    //check duplicate date and insert to like table
    like.find({'userID':uid,'postID':pid}, 'userID,postID', function(err,result){
      if(err)console.log(err);
      if(result.length != 0)
      {
        like.find({'postID':pid},function(err,l){
          if(err)console.log(err);
          console.log(l);
          socket.emit('new like res', {status:'no',count:l});
        }).populate('userID');

      }else{
        insertToLikeTable(uid,pid);
        like.find({'postID':pid},function(err,l){
          if(err)console.log(err);
          socket.emit('new like res', {status:'yes',count:l});
          socket.emit('new like res2', {status:'yes',count:l});
          socket.broadcast.emit('new like res', {status:'yes',count:l});
        }).populate('userID');

      }
    });

  });
});
