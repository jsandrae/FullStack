"use strict";
var sessionUsername;
var isLoggedIn;
var doRevert;
var fadeTimer = 200;

var debug=false;

/**
 * Function to initialize the page and set event handlers
 */
function init(){
  // at start of page, user is not logged in
  loggedOut();
  doRevert = false;
  $('div.btn-sign.logout').on('click',function(){
    console.log('clicked')
    loggedOut();
  });
  // add event handler to debug trip button
  $("a.trip-window").on('click',function(){
    $('#trip-box').fadeIn(fadeTimer);
  });
  // add event handler to create a new account
  $('#createAccount').on('click',function(){
    $('.incorrectMessage').fadeOut(5);
    createAccount();
  });
  // Add event handler to Save button
  $('#login-box').on('click','button#signInButton',function() {
    console.log('signin clicked')
    // remove any previously added messages
    $('.incorrectMessage').fadeOut(5);
    //Saving the username and password
    var username = $('#username').val();
    var password = $('#password').val();

    validateLogin(username,password);
  });
}

function saveTrip(username){
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
    data: CircularJSON.stringify(newTrip),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
		success: function(response) {
      console.log("Saved trip response:")
			console.log(response)
      showTrip({"startLoc":startLoc, "finalLoc":finalLoc}, username, 'table.one tbody');
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
  // Add trip box for trip box and re-add mask
  $('#trip-box').fadeIn(fadeTimer);
  $('body').append('<div id="mask"></div>');
  $('#mask').fadeIn(fadeTimer);
  // Add event handler for show trip modal window
  $('a.modalTrips').on('click', function() {
    $('.modalDialog').fadeOut(fadeTimer);
    $('#mask').fadeOut(fadeTimer);
  });
  // Query server to find all trips for this username
  if (debug){
    $.ajax({
      type: 'POST',
      url: '/loadTrips',
      data: JSON.stringify({"username":username}),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
  		success: function(response) {
        console.log(response)
        populateTrips(response);
      },
      error: function(error) {
        console.log("Saved Trip error")
        console.log(error);
      }
  	});
  }
}

/**
 * Function to take JSON object and populate a table with the response
 */
function populateTrips(response){
  var $tbody = $('<tbody>');
  for (property in response){
    debugger;
    var username = response.username;
    var startLoc = response.startLoc;
    var finalLoc = response.finalLoc;
  }
}

function loggedIn(username){
  isLoggedIn = true;
  sessionUsername = username;
  $('div.btn-sign.logout').show();
}

function loggedOut(){
  isLoggedIn = false;
  $('div.btn-sign.logout').hide();
}

/**
 * Function to run on page Load
 */
$(document).ready(function(){
  init();
  loginPopup();
  rescaleWindow();
});

// Function to change size of window properties
function rescaleWindow(){
  // Find map width and assign it to search bar
  var mapWidth = $('#map').width();
  $('#searchbox').css('width',mapWidth);
}

// Function to delay window resizing to a fixed interval to reduce usage
$(function() {
    var timer_id;
    var delay = 200;

    $(window).resize(function() {
        clearTimeout(timer_id);
        timer_id = setTimeout(function() {
            rescaleWindow();
        }, delay);
    });
});
