var mapView = (function() {
    const mapContainer = document.getElementById('map');
    const markers = {};
    let map;
    let info;

    function init() {
        const mapOptions = {
            center: { lat: 37.7749, lng: -122.4194 },
            zoom: 12,
            streetViewControl: false
        }
        map = new google.maps.Map(mapContainer, mapOptions);
        info = new google.maps.InfoWindow();
        return map;
    };

    function setMarkerMap(place) {
        if (markers[place.id]) {
            markers[place.id].setMap(map);
            return;
        }
        const markerOpt = {
            position: place.location,
            animation: google.maps.Animation.DROP,
            label: place.name,
            id: place.place_id,
            icon: "images/hearts.svg",
            map: map
        };
        const marker = new google.maps.Marker(markerOpt);
        addMarkerList(marker);

        marker.addListener('click', function() {
            placesViewModel.requestPlaceDetail(this, openInfoWindow);
        });

    };

    function openInfoWindow(marker, infoContent) {
        console.log(infoContent)
        info.open(map, marker);
        info.setContent(infoContent);
    }

    function addMarkerList(marker) {
        markers[marker.id] = marker;
    };

    function removeMarkerMap(id) {
        markers[id].setMap(null);
    };

    return {
        init: init,
        setMarkerMap: setMarkerMap
    };
})();