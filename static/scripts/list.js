function tieSignIn(){
  $('button#signInButton').on('click',function() {
    // remove any previously added messages
    $('.incorrectMessage').fadeOut(5);
    //Saving the username and password
    var $username = $('#username');
    var $password = $('#password');

    var username = $('#username').val();
    var password = $('#password').val();

    validateLogin(username,password);
    console.log('tested validation: '+isValid)

    if (isValid) {
      $('#login-box').fadeOut(300);}
    else {
      // remove password from text field
      $password.text('');
      var $incorrect = $('<p>').attr('class','incorrectMessage');
      $incorrect.text('Sorry, incorrect login.');
      $incorrect.insertBefore($('#signInButton'));
    }

  });
}
