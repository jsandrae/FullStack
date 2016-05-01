function loginPopup() {
	$('a.login-window').on('click',function() {

		// if user is not logged in, popup login
		if(!isLoggedIn){
			// Getting the variable's value from a link
			var loginBox = $(this).attr('href');

			//Fade in the Popup and add close button
			$(loginBox).fadeIn(fadeTimer);

			//Set the center alignment padding + border
			var popMargTop = ($(loginBox).height() + 24) / 2;
			var popMargLeft = ($(loginBox).width() + 24) / 2;

			$(loginBox).css({
				'margin-top' : -popMargTop,
				'margin-left' : -popMargLeft
			});

			// Add the mask to body
			$('body').append('<div id="mask"></div>');
			$('#mask').fadeIn(fadeTimer);

		}
	});
	// When clicking on the button close or the mask layer the popup closed
	$('a.close, #mask').on('click', function() {
		console.log('close clicked')
	  $('#mask , .login-popup').fadeOut(fadeTimer , function() {
			$('#mask').remove();
			if(doRevert){
				revertLogin();
			}
		});
	});
};

/**
 * Function to revert login popup to login from create account
 */
function revertLogin(){
	$('label.confirmPass').remove();
	var $button = $('button#createButton');
	$button.attr('id','signInButton');
	// change button text
	$button.text('Sign in')
	// hide account creation link
	$('#createAccount').show();
	doRevert = false;
}

/**
 * Function to create a new user account
 */
function createAccount(){
	doRevert = true;
	// Add new information and text field for password confirmation
	var $confirmLabel = $('<label>').addClass('confirmPass');
	var $confirmSpan = $('<span>').text('Confirm Password');
	var $confirmInput = $('<input>').attr('id','confirmPass');
	$confirmInput.attr('value','');
	$confirmInput.attr('type','password');
	$confirmInput.attr('placeholder','Confirm Password');
	$confirmLabel.append($confirmSpan,$confirmInput);
	$confirmLabel.insertAfter($('label.password'));
	// change submit button functionallity
	var $button = $('button#signInButton');
	$button.attr('id','createButton');
	// change button text
	$button.text('Confirm Account')
	// hide account creation link
	$('#createAccount').hide();
	// add event handler for new button
	$button.on('click',function(){
		var username = $('#username').val();
    var password = $('#password').val();
		var confirmPass = $('#confirmPass').val();
		$('.incorrectMessage').fadeOut(5);
		var passwordMatch = (password === confirmPass);
		if(passwordMatch){
			createAccountRequest(username, password);
		} else {
			errorMessage('Sorry, passwords do not match.','#createButton');
		}
	});
}

/**
 * Function to display login error message
 */
function errorMessage(message, button){
	// remove password from text field
	$('#password').val('');
	if(button === '#createButton'){
		$('#confirmPass').val('');
	}
	var $incorrect = $('<p>').attr('class','incorrectMessage');
	$incorrect.text(message);
	$incorrect.insertBefore($(button));
}

/**
 * Function to save account data to server to be stored in database
 */
function createAccountRequest(username, password){
	var newLogin = {'username': username, 'password':password};
	var isValid;
	//var headers = {'Content-Type': 'application/json'}
	$.ajax({
    type: 'POST',
    url: '/createAccount',
    data: JSON.stringify(newLogin),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
		success: function(response) {
			if(response['status'] === 'OK'){
				console.log(response)
				isLoggedIn = true;
	      saveTrip(username);
			} else {
				errorMessage('Sorry, a user by that username already exists','#createButton');
			}
    },
    error: function(error) {
      console.log(error);
    }
	});
}

/**
 * Function to validate a password for a given username
 */
function validateLogin(username, password){
	var newLogin = {'username': username, 'password':password};
	//var headers = {'Content-Type': 'application/json'}
	$.ajax({
    type: 'POST',
    url: '/login',
    data: JSON.stringify(newLogin),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
		success: function(response) {
      console.log(response);
			var status = response['status'];
			if (status !== 'OK'){
				errorMessage(status,'#signInButton');
			} else {
				var isValid = response['isValid']===true;
				console.log(isValid)
				ajaxResponse(isValid, username);
			}
    },
    error: function(error) {
      console.log(error);
    }
	});
}

/**
 * Function to be called from ajax response function for asynchronisity sake
 */
function ajaxResponse(isValid, username){
	if (isValid) {
		isLoggedIn = true;
		saveTrip(username);
	} else {
		errorMessage('Sorry, incorrect login.','#signInButton');
		// remove password from text field
		$('#password').val('');
		var $incorrect = $('<p>').attr('class','incorrectMessage');
		$incorrect.text();
		$incorrect.insertBefore();
	}
}
