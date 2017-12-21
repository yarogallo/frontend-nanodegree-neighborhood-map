var mapView = (function() {
    const mapContainer = document.getElementById('map');
    const markers = {};
    let openMarker = null;
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
        info.addListener("closeclick", stopBouncingMarker);
        return map;
    };

    function setMarkerMap(place) {
        if (markers[place.placeId]) {
            markers[place.placeId].setMap(map);
            return;
        }
        const markerOpt = {
            position: place.location,
            animation: google.maps.Animation.DROP,
            placeId: place.placeId,
            icon: "images/hearts.svg",
            map: map
        };
        const marker = new google.maps.Marker(markerOpt);
        addMarkerList(marker);

        marker.addListener('click', function() {
            placesViewModel.getPlaceDetails(this.placeId, openInfoWindow);
        });

    };

    function openInfoWindow(err, objDetail) {
        let content;
        let marker;
        if (err) {
            content = `<div><h3>an error has occurr ${err}</h3></div>`;
        } else {
            content = '<div class="infoContent text-black" >' +
                '<div><p class="fontawesome-heart"><strong>Name:</strong> ' + objDetail.name + '</p></div>' +
                '<div><p class="fontawesome-map-marker"><strong>Address: </strong>' + objDetail.address + '</p></div>' +
                '<div><p class="fontawesome-phone"><strong>Phone number: </strong>' + objDetail.phoneNumber + '</p></li>' +
                '<div><p><strong class="fontawesome-thumbs-up">Raiting: </strong>' + objDetail.rating + '</p></div>' +
                '<div><p><strong class="fontawesome-link" target="_blank">Url: </strong><a href="' + objDetail.url + '">Find me here</a></p></li>' +
                '<div><p class="fontawesome-calendar"><strong>Open Now: </strong>' + objDetail.openNow + '</p></div>' +
                '</div>';
        };
        marker = markers[objDetail.placeId]
        info.open(map, marker);
        info.setContent(content);
        bouncingMarker(objDetail.placeId)
    };

    function bouncingMarker(placeId) {
        if (openMarker) {
            stopBouncingMarker();
        };
        markers[placeId].setAnimation(google.maps.Animation.BOUNCE);
        openMarker = markers[placeId];
    };

    function stopBouncingMarker() {
        if (!openMarker) {
            return;
        }
        openMarker.setAnimation(null);
        openMarker = null;
    };

    function addMarkerList(marker) {
        markers[marker.placeId] = marker;
    };

    function removeMarkerMap(placeId) {
        markers[placeId].setMap(null);
    };

    return {
        init: init,
        setMarkerMap: setMarkerMap,
        bouncingMarker: bouncingMarker,
        stopBouncingMarker: stopBouncingMarker,
        openInfoWindow: openInfoWindow
    };
})();