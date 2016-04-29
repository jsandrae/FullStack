var storedplaces = [];
 var markers = [];
var markerindi = -1
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 3,
       mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });


  var input = document.getElementById('searchbox');
var searchBox = new google.maps.places.SearchBox(input);

 

map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

 

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }


    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];


    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
markerindi++
  
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location   
      }));
          var textbox = '<button onclick="storeplace( markers[' + markerindi + '])">Click Me! I am button ' + markerindi + '</button>'
         var infowindow = new google.maps.InfoWindow({
    content: textbox
  });   
          markers[markerindi].addListener('click', function() {
    infowindow.open(map, markers[markerindi]);
  });

      if (place.geometry.viewport) {
 
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

storeplace = function(place) {
    storedplaces.push(place);
    console.log("Sucess!");
    console.log(place);
}
