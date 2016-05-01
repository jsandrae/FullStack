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
  });
}
