function loginPopup() {
	$('a.login-window').on('click',function() {

		// if user is not logged in, popup login
		if(!isLoggedIn){
			// Getting the variable's value from a link
			var loginBox = $(this).attr('href');

			//Fade in the Popup and add close button
			$(loginBox).fadeIn(300);

			//Set the center alignment padding + border
			var popMargTop = ($(loginBox).height() + 24) / 2;
			var popMargLeft = ($(loginBox).width() + 24) / 2;

			$(loginBox).css({
				'margin-top' : -popMargTop,
				'margin-left' : -popMargLeft
			});

			// Add the mask to body
			$('body').append('<div id="mask"></div>');
			$('#mask').fadeIn(300);

			// Add event handler for signing in
			$('#signInButton').on('click',function(){


			})
		} else { // else save trip to user

		}

		return false;
	});

	// When clicking on the button close or the mask layer the popup closed
	$('a.close, #mask').on('click', function() {
	  $('#mask , .login-popup').fadeOut(300 , function() {
		$('#mask').remove();
	});
	return false;
	});
};

/**
 * Function to create a new user account
 */
function createAccount(){
	var $confirmLabel = $('<label>').addClass('confirmPass');
	var $confirmSpan = $('<span>').text('Confirm Password');
	var $confirmInput = $('<input>').attr('id','confirmPass');
	$confirmInput.attr('value','');
	$confirmInput.attr('placeholder','Confirm Password');
	$confirmLabel.append($confirmSpan,$confirmInput);
	$confirmLabel.insertAfter($('label.password'));
}

/**
 * Function to validate a password for a given username
 */
function validateLogin(username, password){
	var newLogin = {'username': username, 'password':password};
	var isValid;
	//var headers = {'Content-Type': 'application/json'}
	$.ajax({
    type: 'POST',
    url: '/login',
    data: JSON.stringify(newLogin),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
		success: function(response) {
      console.log(response);
			isValid = response['isValid']===true;
			console.log(isValid)
			ajaxResponse(isValid);
    },
    error: function(error) {
      console.log(error);
    }
	});
}

/**
 * Function to be called from ajax response function for asynchronisity sake
 */
function ajaxResponse(isValid){
	if (isValid) {
		$('#login-box').fadeOut(300);}
	else {
		// remove password from text field
		$('#password').val('');
		var $incorrect = $('<p>').attr('class','incorrectMessage');
		$incorrect.text('Sorry, incorrect login.');
		$incorrect.insertBefore($('#signInButton'));
	}
}
