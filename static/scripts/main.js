"use strict";
//Temporary global varriables for debug purposes
var username;
var password;
var isLoggedIn;

var debug=true;

/**
 * Function to initialize the page and set event handlers
 */
function init(){
  // at start of page, user is not logged in
  isLoggedIn = false;
  // add event handler to debug trip button
  $("a.trip-window").on('click',function(){
    $('#trip-box').fadeIn(300);
  });
  // add event handler to create a new account
  $('#createAccount').on('click',function(){
    createAccount();
  })
}

/**
 * Function to run on page Load
 */
$(document).ready(function(){
  init();
  tieSignIn();
  loginPopup();

});
