
var markers = [];
var markerindi = -1
var tableIndex = 0;
var waypoints = [];
var myStoredPlaces = {};
var myStoredPlacesNames = [];
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.0902, lng: -95.7129},
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
                featureType: 'poi',
                stylers: [{visibility: 'off'}]  // Turn off points of interest.
            }, {
                featureType: 'transit.station',
                stylers: [{visibility: 'off'}]  // Turn off bus stations, train stations, etc.
            }],
        disableDoubleClickZoom: true
    });
    directionsDisplay.setMap(null)

    var input = document.getElementById('searchbox');
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
        
        var places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }


        getdirections = function () {
 debugger
            waypoints = [];
            if (myStoredPlacesNames.length > 2) {

                for (var i = 1; i < myStoredPlacesNames.length - 1; i++) {
                    waypoints.push({
                        location: myStoredPlaces[myStoredPlacesNames[i]].getPosition(),
                        stopover: true
                    })

                }
            } else {
                waypoints = [];
            }

            if (myStoredPlacesNames.length > 1) {
               
                directionsDisplay.setMap(map)
                var startpoint = myStoredPlaces[myStoredPlacesNames[0]].getPosition();
                var endpoint = myStoredPlaces[myStoredPlacesNames[myStoredPlacesNames.length -1]].getPosition()
                directionsService.route({
                    origin: startpoint,
                    destination: endpoint,
                    waypoints: waypoints,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        var route = response.routes[0];

                        // For each route, display summary information.

                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                })
            } else {
                directionsDisplay.setMap(null)
            }

        }
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        var markerindi = -1;



        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            markerindi++;

            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            var textbox = '<center><p>' + markers[markerindi].title + '</p><button onclick="myStorePlace( markers[' + markerindi + '])">Add to Places</button></center>'
            makeinfobox(markers[markerindi], textbox);

            if (place.geometry.viewport) {

                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }


        });
        map.fitBounds(bounds);
    });

    if (myStoredPlaces.length > 2) {
        for (var i = 1; i < myStoredPlaces.length - 1; i++) {
            waypoints.push(myStoredPlaces[i])
        }
    }

}

var makeinfobox = function (marker, message) {
    var infowindow = new google.maps.InfoWindow({
        content: message,
        alignBottom: true,
        pixelOffset: new google.maps.Size(-25, 0)
    });
    marker.addListener('click', function () {
        infowindow.open(marker.get('map'), marker);
    });
}
/**
 * Function to take a given geoJSON object and add it to the overall place object
 * @param place: geoJSON object with identifing information regarding the saved place
 */
var myStorePlace = function (place){
   
  // Create a new id for this object
  var newID = 'id'+tableIndex++;
  myStoredPlacesNames.push(newID);
  var title = place.title;
  var $newRow = $("<tr>").addClass('place'); //create a new table row of class place
  $($newRow).attr('id',newID); // add the new id to row
  var $name = $('<td>').text(' '+ title +' ');
  var $remove = $('<td>').text(' X ');
  // add new place to object
  myStoredPlaces[newID] = place;
  getdirections()
  // add event handler for removing row from table and data from place object
  $($remove).on('click', function(){
    console.log('clicked')
    // remove table from row
    $('#'+newID).hide(100);
    delete myStoredPlaces[newID];
    myStoredPlacesNames.splice(myStoredPlacesNames.indexOf(newID), 1)
    getdirections()
  });
  // add elements to row
  $newRow.append($name,$remove);
  $('tbody').append($newRow);
  //other stuff
}


