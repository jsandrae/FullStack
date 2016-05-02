"use strict";
//Temporary global varriables for debug purposes
//var username;
//var password;
var isLoggedIn;
var doRevert;
var fadeTimer = 200;

var debug=true;

/**
 * Function to initialize the page and set event handlers
 */
function init(){
  // at start of page, user is not logged in
  isLoggedIn = false;
  doRevert = false;
  // add event handler to debug trip button
  $("a.trip-window").on('click',function(){
    $('#trip-box').fadeIn(fadeTimer);
  });
  // add event handler to create a new account
  $('#createAccount').on('click',function(){
    $('.incorrectMessage').fadeOut(5);
    createAccount();
  });
}

function saveTrip(username){debugger;
  var placeObject = {},
      placeID,
      startLoc = null,
      finalLoc;
  // Take places out of an object and place in an array
  for (placeID in myStoredPlaces){
    var place = myStoredPlaces[placeID];
    var placeName = place.getTitle();
    if (startLoc === null){
      startLoc = placeName;
    }
    finalLoc = placeName;
    placeObject[placeName] = place;
  }
  var newTrip = {
    'username':username,
    'startLoc':startLoc,
    'finalLoc':finalLoc,
    'trip':myStoredPlaces
  }
  $.ajax({
    type: 'POST',
    url: '/saveTrip',
    data: CircularJSON.stringify(newTrip)
    /*( newTrip, function( key, value) {
      if( key == 'parent') { return value.id;}
      else {return value;}
    })*/,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
		success: function(response) {
      console.log("Saved trip response:")
			console.log(response)
      //showTrip({"startLoc":startLoc, "finalLoc":finalLoc}, username);
    },
    error: function(error) {
      console.log("Saved Trip error")
      console.log(error);
    }
	});
}

function showTrip(placeArray, username){
  // Remove login popup and mask
  $('#mask').fadeOut(fadeTimer);
  $('#login-box').fadeOut(fadeTimer);
  // Add trip box, event handler for trip box and re-add mask
  $('#trip-box').fadeIn(fadeTimer);
  $('a.modalTrips').on('click', function() {
    $('.modalDialog').fadeOut(fadeTimer);
    $('#mask').fadeOut(fadeTimer);
  });
  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(fadeTimer);
}

/**
 * Function to run on page Load
 */
$(document).ready(function(){
  init();
  tieSignIn();
  loginPopup();

});
