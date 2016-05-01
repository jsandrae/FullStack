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

function saveTrip(username){
  var placeArray = [],
      placeID,
      firstID = null,
      startLoc,
      finalLoc;
      console.log(myStoredPlaces)
debugger;
  // Take places out of an object and place in an array
  for (placeID in myStoredPlaces){
    if (firstID === null){
      firstID = placeID;
      startLoc = myStoredPlaces[firstID].getTitle();
    }
    var place = myStoredPlaces[placeID];
    finalLoc = place.getTitle();
    placeArray.push({placeID:place});
  }
  var newObject = {
    'username':username,
    'startLoc':startLoc,
    'finalLoc':finalLoc,
    'trip':placeArray
  }
  $.ajax({
    type: 'POST',
    url: '/saveTrip',
    data: JSON.stringify(newObject),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
		success: function(response) {
			console.log(response)
      showTrip({"startLoc":startLoc, "finalLoc":finalLoc}, username);
    },
    error: function(error) {
      console.log(error);
    }
	});
}

function showTrip(placeArray, username){
  $('#mask').fadeOut(fadeTimer);
  $('#login-box').fadeOut(fadeTimer);
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
