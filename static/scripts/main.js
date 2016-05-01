"use strict";
//Temporary global varriables for debug purposes
var username;
var password;
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

function saveTrip(){
  debugger;
}

function showTrip(){
  isLoggedIn = true;
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
