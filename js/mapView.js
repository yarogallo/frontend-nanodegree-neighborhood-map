mapView = (function() {
    const mapContainer = document.getElementById('map');
    const markers = {}; //All markers
    let openMarker = null; //The marker that is actuallly been animated
    let map;
    let info;

    const openInfoWindow = (marker, content) => { //Open infoWindow in a specific marker with specific content
        info.open(map, marker);
        info.setContent(content);
    };

    const getHtmlContent = (objDetail) => { //Generate content to show in the infoWindow
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

    const addMarker = (marker) => { markers[marker.placeId] = marker; }; //Add marker to markers hash, using placeId as a key

    const bounceMarker = (marker) => { //Given a marker, set it to bounce
        if (openMarker) stopBounceMarker();
        marker.setAnimation(google.maps.Animation.BOUNCE);
        openMarker = marker;
    };

    const stopBounceMarker = () => { // Stop marker that is bouncing
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
            info.addListener("closeclick", stopBounceMarker); //When infoWindow is closed, stop bouncing the asociated marker
            return map;
        },
        createMarkerMap: function(place) { //Given a place, create a marker if it doesn't exist
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
        openInfoWindowWithPlaceDetails: function(objDetail) { //Given a placeDetail, open an infoWindow
            openInfoWindow(markers[objDetail.placeId], getHtmlContent(objDetail));
        },
        removeMarkerMap: function(placeId) { //Remove specific marker from the map
            markers[placeId].setMap(null);
        },
        showMarkerMap: function(placeId) { //Show specific marker on the map, given placeId
            markers[placeId].setMap(map);
        },
        changeMarkerLabel: function(placeId, newNumber) { //Change label to a specific marker 
            markers[placeId].set('label', newNumber.toString());
        }
    };
})();