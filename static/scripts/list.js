function tieSignIn(){
  $('#login-box').on('click','button#signInButton',function() {
    // remove any previously added messages
    $('.incorrectMessage').fadeOut(5);
    //Saving the username and password
    var username = $('#username').val();
    var password = $('#password').val();

    validateLogin(username,password);
  });
}
