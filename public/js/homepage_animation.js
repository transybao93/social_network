$(document).ready(function()
{
  $('.comment_area').hide();
  $('.btn_comment').click(function(){
    $(this).next().toggle();
  });

});
