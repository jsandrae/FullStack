//Array Tracker for markers
var markers = [];
//Marker Indicator, To be used in google maps api
var markerindi = -1
//Tracker for table index for html placement
var tableIndex = 0;
//Array for waypoints, To be used in google maps api
var waypoints = [];
//Local array for storing places, Accessed by google maps api to create markers and routes
var myStoredPlaces = {};
//Used for iterating through storedplaces.
var myStoredPlacesNames = [];
//Required for google maps api, Map object.
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.0902, lng: -95.7129},
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
                featureType: 'poi',
                stylers: [{visibility: 'off'}]
            }, {
                featureType: 'transit.station',
                stylers: [{visibility: 'off'}]
            }],
        disableDoubleClickZoom: true
    });
    //This makes the direction display in maps invisable at first.
    directionsDisplay.setMap(null)
//Retrives search box element and hooks it with google maps api
    var input = document.getElementById('searchbox');
    var searchBox = new google.maps.places.SearchBox(input);
//This changed the maps viewing location or "Bounds"
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function () {

        var places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

//This function uses the google routing api along with a few loops and if statements
//to properly render locations each time it is called
        getdirections = function () {
            /*Waypoints are what is required for rendering more then 2 locations, Upon each
             * run it will empty out waypoints.
             */

            waypoints = [];
            //This makes it so it will only calculate waypoints if there is more then 2 locations
            if (myStoredPlacesNames.length > 2) {
                /*This for loop pushes waypoints from myStored places. It will always avoid
                 * pushing the starting and ending locations
                 */
                for (var i = 1; i < myStoredPlacesNames.length - 1; i++) {
                    waypoints.push({
                        location: myStoredPlaces[myStoredPlacesNames[i]].getPosition(),
                        stopover: true
                    })

                }
            }
//Insures it will only generate directions if there is at least 2 locations
            if (myStoredPlacesNames.length > 1) {
                /*
                 * The following is required for google directions api with a few
                 * tweaks. it will first make the directions visable on the map
                 * then it declares the starting and ending points using both
                 * mystoredplaces and mystoredplacesnames.
                 */
                directionsDisplay.setMap(map)
                var startpoint = myStoredPlaces[myStoredPlacesNames[0]].getPosition();
                var endpoint = myStoredPlaces[myStoredPlacesNames[myStoredPlacesNames.length - 1]].getPosition()
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



                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                })
            } else {
                /*
                 * If there is less then 2 locations, this makes the map invisable
                 * This is handy incase the user deletes enough locations where
                 * there is less then 2 remaining
                 */
                directionsDisplay.setMap(null)
            }

        }
        //The following is ran when google maps is being searched this emptys out the markers
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
//This resets the marker indicator
        var markerindi = -1;

//Changes the google map view upon search
        var bounds = new google.maps.LatLngBounds();
        //Prepares icon location for each place found
        places.forEach(function (place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            markerindi++;
//This pushes the marker information for each place found
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
/*
 * This creates a text box for each place found, it will then find it using the
 * makeinfobox function
 *
 */
            //'<center><p>' + markers[markerindi].title + '</p><button onclick="myStorePlace( markers[' + markerindi + '])">Add to Places</button></center>'
            var textBox = document.createElement("div");
            textBox.id = 'titleName';

            var $titleName = $('<p>').text(markers[markerindi].title);
            $($titleName).addClass('mapPopup mapPopupTitle');
            var $titleCommand = $('<p>').text('Add to places');
            $($titleCommand).addClass('mapPopup mapPopupText');

            $(textBox).append($titleName,$titleCommand);
            // Add event handler for $textBox
            $(textBox).on('click',function(){
              myStorePlace( markers[markerindi]);
            });

            makeinfobox(markers[markerindi], textBox);

            if (place.geometry.viewport) {

                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }


        });
        map.fitBounds(bounds);
    });



}
/*
 * The following function binds the infomessage and marker together. Making sure
 * that the infobox is in the proper location and adds a listener when a location
 * is clicked.
 */
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
var myStorePlace = function (place) {
    // Clear search text field
    $('#searchbox').val('');

    // Create a new id for this object
    var newID = 'id' + tableIndex++;
    myStoredPlacesNames.push(newID);
    var title = place.title;
    var $newRow = $("<tr>").addClass('place'); //create a new table row of class place
    $($newRow).attr('id', newID); // add the new id to row
    var $name = $('<td>').text(' ' + title + ' ');
    var $remove = $('<td>').text(' X ');
    // add new place to object
    myStoredPlaces[newID] = place;
    getdirections()
    // add event handler for removing row from table and data from place object
    $($remove).on('click', function () {
        console.log('clicked')
        // remove table from row
        $('#' + newID).hide(100);
        delete myStoredPlaces[newID];
        myStoredPlacesNames.splice(myStoredPlacesNames.indexOf(newID), 1)
        getdirections()
    });
    // add elements to row
    $newRow.append($name, $remove);
    $('tbody').append($newRow);
    //other stuff
}

var retrivePlaces = function (place) {
    for(var i = 0; i < place.length; i++) {
        myStorePlace(place);
    }
}
var storePlace = function (place) {
    var Tripname = {
        start: myStoredPlaces[myStoredPlacesNames[0]].title,
        destination: myStoredPlaces[myStoredPlacesNames[myStoredPlacesNames.length-1]].title
    }
    for(var i = 0; i < myStoredPlacesNames.length; i++) {
        myStoredPlaces[myStoredPlacesNames[i]]
    }
}
