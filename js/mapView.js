mapView = (function() {
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
        };
        map = new google.maps.Map(mapContainer, mapOptions);
        info = new google.maps.InfoWindow();
        info.addListener("closeclick", stopBouncingMarker);
        return map;
    }

    function createMarkerMap(place) {
        if (markers[place.placeId]) {
            showMarkerMap(place.placeId);
            return;
        }
        const markerOpt = {
            position: place.location,
            animation: google.maps.Animation.DROP,
            placeId: place.placeId,
            label: place.number.toString(),
            icon: "images/hearts.svg",
            map: map
        };
        const marker = new google.maps.Marker(markerOpt);
        addMarkerList(marker);

        marker.addListener('click', function() {
            placesViewModel.showPlaceDetail(this.placeId);
            bouncingMarker(this.placeId);
        });

    }

    function openInfoWindowWithPlaceDetails(objDetail) {
        let content;
        if (!objDetail) {
            content = `<div><h3>an error has occurred</h3></div>`;
            return;
        }
        content = `<div class="infoContent text-black" >
            <div><p class="fontawesome-heart"><strong>Name:</strong>${objDetail.name} </p></div>
            <div><p class="fontawesome-map-marker"><strong>Address: </strong>${objDetail.address} </p></div>
            <div><p class="fontawesome-phone"><strong>Phone number: </strong>${objDetail.phoneNumber} </p></li>
            <div><p><strong class="fontawesome-thumbs-up">Raiting: </strong>${objDetail.rating} </p></div>
            <div><p><strong class="fontawesome-link" target="_blank">Url: </strong><a href="${objDetail.url}">Find me here</a></p></li>
            <div><p class="fontawesome-calendar"><strong>Open Now: </strong>${objDetail.openNow}</p></div>
            </div>`;

        openInfoWindow(markers[objDetail.placeId], content);
    }

    function openInfoWindow(marker, content) {
        info.open(map, marker);
        info.setContent(content);
    }

    function bouncingMarker(placeId) {
        if (openMarker) {
            stopBouncingMarker();
        }
        markers[placeId].setAnimation(google.maps.Animation.BOUNCE);
        openMarker = markers[placeId];
    }

    function stopBouncingMarker() {
        if (!openMarker) {
            return;
        }
        openMarker.setAnimation(null);
        openMarker = null;
    }

    function addMarkerList(marker) {
        markers[marker.placeId] = marker;
    }

    function removeMarkerMap(placeId) {
        markers[placeId].setMap(null);
    }

    function showMarkerMap(placeId) {
        markers[placeId].setMap(map);
    }

    function reorderMarkers(placeId, newNumber) {
        markers[placeId].set('label', newNumber.toString());
    }

    return {
        init: init,
        createMarkerMap: createMarkerMap,
        animateMarker: bouncingMarker,
        stopMarkerAnmation: stopBouncingMarker,
        openInfoWindowWithPlaceDetails: openInfoWindowWithPlaceDetails,
        removeMarkerMap: removeMarkerMap,
        showMarkerMap: showMarkerMap,
        reorderMarkers: reorderMarkers
    };
})();