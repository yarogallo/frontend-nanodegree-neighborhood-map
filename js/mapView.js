mapView = (function() {
    const mapContainer = document.getElementById('map');
    const markers = {};
    let openMarker = null;
    let map;
    let info;

    const openInfoWindow = (marker, content) => {
        info.open(map, marker);
        info.setContent(content);
    };

    const addMarker = (marker) => { markers[marker.placeId] = marker; };

    const getHtmlContent = (objDetail) => {
        if (!objDetail) return `<div><h3>an error has occurred</h3></div>`;
        return `<div class="infoContent text-black" >
            <div><p class="fontawesome-heart"><strong>Name:</strong>${objDetail.name} </p></div>
            <div><p class="fontawesome-map-marker"><strong>Address: </strong>${objDetail.address} </p></div>
            <div><p class="fontawesome-phone"><strong>Phone number: </strong>${objDetail.phoneNumber} </p></li>
            <div><p><strong class="fontawesome-thumbs-up">Raiting: </strong>${objDetail.rating} </p></div>
            <div><p><strong class="fontawesome-link" target="_blank">Url: </strong><a href="${objDetail.url}">Find me here</a></p></li>
            <div><p class="fontawesome-calendar"><strong>Open Now: </strong>${objDetail.openNow}</p></div>
            </div>`;
    };

    const bounceMarker = (marker) => {
        if (openMarker) stopBounceMarker();
        marker.setAnimation(google.maps.Animation.BOUNCE);
        openMarker = marker;
    };

    const stopBounceMarker = () => {
        if (!openMarker) return;
        openMarker.setAnimation(null);
        openMarker = null;
    };

    return {
        init: function() {
            map = new google.maps.Map(mapContainer, {
                center: { lat: 37.7749, lng: -122.4194 },
                zoom: 12,
                streetViewControl: false
            });
            info = new google.maps.InfoWindow();
            info.addListener("closeclick", stopBounceMarker);
            return map;
        },
        createMarkerMap: function(place) {
            if (markers[place.placeId]) {
                this.showMarkerMap(place.placeId);
                return;
            }
            const marker = new google.maps.Marker({
                position: place.location,
                animation: google.maps.Animation.DROP,
                placeId: place.placeId,
                label: place.number.toString(),
                icon: "images/hearts.svg",
                map: map
            });
            addMarker(marker);
            marker.addListener('click', function() {
                placesViewModel.showPlaceDetail(this.placeId);
                bounceMarker(this);
            });

        },
        animateMarker: function(placeId) {
            bounceMarker(markers[placeId]);
        },
        stopMarkerAnimation: function() {
            stopBounceMarker();
        },
        openInfoWindowWithPlaceDetails: function(objDetail) {
            openInfoWindow(markers[objDetail.placeId], getHtmlContent(objDetail));
        },
        removeMarkerMap: function(placeId) {
            markers[placeId].setMap(null);
        },
        showMarkerMap: function(placeId) {
            markers[placeId].setMap(map);
        },
        reorderMarkers: function(placeId, newNumber) {
            markers[placeId].set('label', newNumber.toString());
        }
    };
})();