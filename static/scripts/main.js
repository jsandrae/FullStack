"use strict";
//Temporary global varriables for debug purposes
var username;
var password;
var isLoggedIn;
var doRevert;

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
    $('#trip-box').fadeIn(300);
  });
  // add event handler to create a new account
  $('#createAccount').on('click',function(){
    $('.incorrectMessage').fadeOut(5);
    createAccount();
  })
}

function showTrip(){
  isLoggedIn = true;
  $('#login-box').fadeOut(300);
  $('#trip-box').fadeIn(300);
}

/**
 * Function to run on page Load
 */
$(document).ready(function(){
  init();
  tieSignIn();
  loginPopup();

});
