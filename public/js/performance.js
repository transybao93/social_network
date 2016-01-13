var socket = io.connect();
var send_form = $('#search-form');
var mess = $('.search-box');
var notification = $('#info ul li');
//gửi data lên server.js
//- li
  //- img(src='/images/people.png')
  //- a(href="#")
  //-   b Bảo
  //-   |  vừa gửi lời mời kết bạn
  //- i 1 phút trước
send_form.submit(function(e){
  e.preventDefault();
  //- $('<li><img src="/images/post.png" alt="" /><a href="#"><b>Bảo</b> vừa đăng 1 bài viết</a><br/><i>5 phút trước</i></li>').slideDown("slow").prependTo('#info ul');
  //- $('#info ul').prepend('<li><img src="/images/post.png" alt="" /><a href="#"><b>Bảo</b> vừa đăng 1 bài viết</a><br/><i>5 phút trước</i></li>');
  socket.emit('chat message', mess.val());
  mess.val('');
});
//nhận tin từ server

socket.on('new mess', function(data){
  //$('<li><img src="/images/post.png" alt="" /><a href="#"><b>Bảo</b> vừa đăng 1 bài viết</a><br/><i>5 phút trước</i></li>').slideDown("slow").prependTo('#info ul');
  for (var r in data) {
    $('<li><img src="/images/people.png" alt="" /><a href="#"><b>'+data[r].nguoiviet+'</b> vừa gửi lời mời kết bạn</a><br/><i>5 phút trước</i></li>').slideDown("slow").prependTo('#info ul');
    alert(data[r].nguoiviet);
  }
});
