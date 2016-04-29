var storedplaces = [];
var markers = [];
var markerindi = -1
var tableindi = 0;
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
    if (storedplaces.length != 0) {
      for(var i = 0; i < storedplaces.length; i++) {
        console.log("Sucess!");
        markers.push(storedplaces[i]);
        storedplaces[i].setMap(map);
      }
    }
    var markerindi = storedplaces.length - 1;

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
}

var makeinfobox = function(marker, message) {
  var infowindow = new google.maps.InfoWindow({
    content: message
  });
  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });
}

var storeplace = function(place) {
  storedplaces.push(place);
  var title = place.title;
  if ((tableindi+1)%2 === 0) {
    $("tbody").append('<tr class="even" id="t' + tableindi +  '"><td>' + title + '</td><td><button onclick="removeplace(' + tableindi + ')">X</button></td></tr>')
  }
  else {
    $("tbody").append('<tr id="t' + tableindi +  '"><td>' + title + '</td><td><button onclick="removeplace(' + tableindi + ')">X</button></td></tr>')
  }
  console.log("Sucess!");
  console.log(place.getPosition());
  tableindi++;
}

removeplace = function(index) {
  $("#t" + index).remove();
  storedplaces[index].setMap(null);
  storedplaces.splice(1, index);
}
