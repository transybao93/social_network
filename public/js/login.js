$(document).ready(function()
{
  (function () {
      $('.info a.link').click(function () {
          return false;
      });
      $('input').blur(function () {
          if ($(this).val()) {
              return $(this).addClass('filled');
          } else {
              return $(this).removeClass('filled');
          }
      });
  }.call(this));
});
