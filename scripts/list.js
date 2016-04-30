$('button#signInButton') .on('click',function() {
  $('#login-box').fadeOut(300);
  
  var username;
  var password;
  
  username = $('#username').text;
  password = $('#password').text;
  
  console.log($('#username').val());
});