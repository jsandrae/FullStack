function initMap() {
  var chicago = {lat: 41.85, lng: -87.65};
  var indianapolis = {lat: 39.79, lng: -86.14};

  var map = new google.maps.Map(document.getElementById('map'), {
    center: chicago,
    scrollwheel: false,
    zoom: 7
  });
  
  var test = new DirectionsService("Asheville NC", "New York NY", google.maps.TravelMode.DRIVING)
  DirectionsService.route(test);

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  // Set destination, origin and travel mode.
  var request = {
    destination: indianapolis,
    origin: chicago,
    travelMode: google.maps.TravelMode.DRIVING
  };

  // Pass the directions request to the directions service.
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // Display the route on the map.
      directionsDisplay.setDirections(response);
    }
  });
}


