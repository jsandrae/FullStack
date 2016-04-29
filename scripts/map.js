var storedplaces = [];
var markers = [];
var markerindi = -1
var tableindi = 0;
var waypoints = [];
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 3,
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
    directionsDisplay.setMap(map)

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
            if (storedplaces.length > 2) {
                for (var i = 1; i < storedplaces.length - 1; i++) {
                    waypoints.push({
                        location: storedplaces[i].getPosition(),
                        stopover: true
                    })

                }
            }

            if (storedplaces.length > 1) {
                var startpoint = storedplaces[0].getPosition();
                var endpoint = storedplaces[storedplaces.length - 1].getPosition()
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

            var textbox = '<center><p>' + markers[markerindi].title + '</p><button onclick="storeplace( markers[' + markerindi + '])">Add to Places</button></center>'
            makeinfobox(markers[markerindi], textbox);

            if (place.geometry.viewport) {

                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }


        });
        map.fitBounds(bounds);
    });

    if (storedplaces.length > 2) {
        for (var i = 1; i < storedplaces.length - 1; i++) {
            waypoints.push(storedplaces[i])
        }
    }

}

var makeinfobox = function (marker, message) {
    var infowindow = new google.maps.InfoWindow({
        content: message
    });
    marker.addListener('click', function () {
        infowindow.open(marker.get('map'), marker);
    });
}


var storeplace = function (place) {
    storedplaces.push(place);
    var title = place.title;
    if ((tableindi + 1) % 2 === 0) {
        $("tbody").append('<tr class="even" id="t' + tableindi + '"><td>' + title + '</td><td><button onclick="removeplace(' + tableindi + ')">X</button></td></tr>')
    } else {
        $("tbody").append('<tr id="t' + tableindi + '"><td>' + title + '</td><td><button onclick="removeplace(' + tableindi + ')">X</button></td></tr>')
    }
    console.log("Sucess!");
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    console.log(place.getPosition());


    tableindi++;
    getdirections();
}

removeplace = function (index) {
    $("#t" + index).remove();
    if (index != 0 || index != storedplaces.length - 1) {
        waypoints.splice(index, 1);
    }
    if (index = 0) {
        storedplaces.pop();
    }
    storedplaces.splice(index, 1);
    tableindi--;
    getdirections();

}

      