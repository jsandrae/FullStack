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
}

/**
 * Function to run on page Load
 */
$(document).ready(function(){
  init();
  tieSignIn();
  loginPopup();

});

// Function to automatically resize all elements within a resized window
function rescaleWindow() {
    console.log("Resizing window ");
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
