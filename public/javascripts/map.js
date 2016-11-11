//initialize array of marked locations
var markedLocations = [];


function initialize() {
    var boston = { lat:42.342132, lng: -71.103023 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: boston
    });

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
        //push marker to array markedLocations
        markedLocations.push( [ event.latLng.lat() , event.latLng.lng() ] );
        //find distance between marked point and various locations
        getDistance( [event.latLng.lat() , event.latLng.lng()] );
    });

    //map these values to index page
    var origin_address = document.getElementById('origin_address');
    var dest_address = document.getElementById('dest_address');
    var distance_in_meters = document.getElementById('distance_in_meters');

}

// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
// Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });

}

//delete markers button
function removeMarkers() {
    markedLocations = []; //reset markedLocations to null
    labelIndex = 0; //reset labelIndex to 0

    //wipe addresses
    origin_address.innerHTML = 'Origin Address: ';
    dest_address.innerHTML = 'Destination Address: ';
    distance_in_meters.innerHTML = 'Distance (meters): ';

    initialize(); //reload the map with no markers
}



//get distance between two (long,lat) points when a marker is clicked
//documentation
//https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
function getDistance(origin) {

    var origin = new google.maps.LatLng(origin[0],origin[1]);
    var destination1 = new google.maps.LatLng(42.4,-71.06);
    //var destination2 = new google.maps.LatLng(50.047692, 14.434150);

    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination1],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    },
    callback);

    function callback(response, status) {
        if (status == "OK") {

            //var origin_address = response.originAddresses;




            origin_address.innerHTML += response.originAddresses;


            dest_address.innerHTML += response.destinationAddresses;


            distance_in_meters.innerHTML += response.rows[0].elements[0].distance.value + ' meters';

            /*
            //add destination addresses to array
            for (var i = 0; i < response.destinationAddresses.length; i++ ) {
                dest_address_array.push(response.destinationAddresses[i]);
            }
            */
            $('#results').html(origin_address);
            //document.getElementById('map') = "HELOlll";
            //alert(distance_in_meters);
            //assign values to index.jade
            document.getElementById('origin_address') = 'TEST';
            document.getElementById('dest_address') = dest_address;
            document.getElementById('distance_in_meters') = distance_in_meters;

        } else {
            alert("Error: " + status);
        }

    }

}


google.maps.event.addDomListener(window, 'load', initialize);
