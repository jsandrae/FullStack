"use strict";
var sessionUsername;
var isLoggedIn;
var doRevert;
var fadeTimer = 200;
var windowHeight;
var tripLog; // Dictionary to store table ids for each trip

var debug=true;

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

/**
 * Function to take JSON object and populate a table with the response
 */
function populateTrips(response){
  var $tbody = $('<tbody>');
  var trips = response['trips'];
  var i;
  // Clear current trip table if any
  $('table.tripList tbody').empty();
  // Clear tripLog
  //tripLog = {};
  for (i=0; i<trips.length; i++){
    var username = trips[i].username;
    var startLoc = trips[i].startLoc;
    var finalLoc = trips[i].finalLoc;
    var _id = trips[i]._id;
    var id = _id.replace(/"/g,'');
    showAllTrips(startLoc,finalLoc, 'tripList'+i, id)
  }
}

/**
 * Function to display all trips in a trip summary table
 */
var showAllTrips = function (startLoc, finalLoc, rowID, tableID) {
  // Create a new id for this object
  var $newRow = $("<tr>").addClass('trip'); //create a new table row of class trip
  $($newRow).attr('id', rowID); // add the new id to row
  var $start = $('<td>').text(' ' + startLoc + ' ');
  var $destination = $('<td>').text(' ' + finalLoc + ' ');
  var $remove = $('<td>').text(' X ');
  //triplog[rowID]=tableID;
  // add event handler for removing row from table and data from place object
  $($remove).on('click', function () {
      console.log('clicked')
      // remove table from row
      $('#' + rowID).hide(100);
      deleteTrip(startLoc, finalLoc, tableID);
  });
  // add elements to row
  $newRow.append($start, $destination, $remove);
  $('table.tripList tbody').append($newRow);
  //other stuff
}

/**
 * Function to send AJAX request to remove a trip from the database
 */
function deleteTrip(startLoc, finalLoc, tableID){
  $.ajax({
    type: 'POST',
    url: '/deleteTrip',
    data: JSON.stringify({'_id':tableID}),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
		success: function(response) {
      console.log(response)
      deleteResponse(startLoc, finalLoc);
    },
    error: function(error) {
      console.log("Saved Trip error")
      console.log(error);
    }
	});
}

/**
 * Funtion to notify user that element has been deleted
 */
function deleteResponse(startLoc, finalLoc){

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
  windowHeight = $(window).height();
  var tableHeight = Math.floor(windowHeight * 0.85);
  var tableMargin = Math.floor((windowHeight-tableHeight)/2);
  $('#tripTable').css('max-height',tableHeight);
  $('#trip-box').css('margin-top',tableMargin);
  $('#trip-box').css('margin-bottom',tableMargin);
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
