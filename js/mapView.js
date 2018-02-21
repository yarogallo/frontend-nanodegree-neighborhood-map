mapView = (function() {
    const mapContainer = document.getElementById('map');
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
            <div><p><i class="fas fa-heart"></i><strong>Name:</strong>${objDetail.name} </p></div>
            <div><p><i class="fas fa-map-marker-alt"></i><strong>Address: </strong>${objDetail.address} </p></div>
            <div><p><i class="fas fa-phone"></i><strong>Phone number: </strong>${objDetail.phoneNumber} </p></li>
            <div><p><i class="fas fa-thumbs-up"></i><strong>Raiting: </strong>${objDetail.rating} </p></div>
            <div><p><i class="fas fa-link"></i><strong target="_blank">Url: </strong><a href="${objDetail.url}">Find me here</a></p></li>
            <div><p><i class="far fa-calendar-alt"></i><strong>Open Now: </strong>${objDetail.openNow}</p></div>
            </div>`;
    };

    const bounceMarker = (marker) => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(() => {
            marker.setAnimation(null);
        }, 800);
    };

    return {
        init: function() {
            map = new google.maps.Map(mapContainer, {
                center: { lat: 37.7749, lng: -122.4194 },
                zoom: 12,
                streetViewControl: false
            });
            info = new google.maps.InfoWindow();
            return map;
        },
        createMarkerMap: function(place) { //Given a place, create a marker if it doesn't exist
            const marker = new google.maps.Marker({
                position: place.location,
                animation: google.maps.Animation.DROP,
                placeId: place.placeId,
                label: place.number.toString(),
                map: map
            });
            marker.addListener('click', function() {
                placesViewModel.showPlaceDetail(this);
                bounceMarker(marker);
            });
            return marker;
        },
        animateMarker: function(marker) {
            bounceMarker(marker);
        },
        closeInfoWindow: function() {
            info.close();
        },
        openInfoWindowWithPlaceDetails: function(marker, objDetail) { //Given a placeDetail, open an infoWindow
            openInfoWindow(marker, getHtmlContent(objDetail));
        }
    };
})();