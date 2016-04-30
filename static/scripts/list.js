function tieSignIn(){
  $('button#signInButton') .on('click',function() {

    //Saving the username and password
    var username;
    var password;

    username = $('#username').text;
    password = $('#password').text;

    var isValid = validateLogin(username,password);

    if (isValid) {
      $('#login-box').fadeOut(300);}
    else {
      var $incorrect = $('<p>');
      $incorrect.text('Sorry, incorrect login.');
      $incorrect.insertBefore($('#signInButton'));
    }

  });
}
