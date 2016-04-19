// Function to run on page Load
$(document).ready(function(){
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
