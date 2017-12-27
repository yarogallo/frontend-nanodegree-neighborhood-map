const ViewModel = function() {

    this.myPlaces = ko.observableArray([]);
    this.openPlace = ko.observable();

    this.init = function() {
        const map = mapView.init();
        placeDetail.init(map);
        places.MY_PLACES.forEach(place => {
            (function(place, vmObj) {
                mapView.setMarkerMap(place);
                vmObj.myPlaces.push(place);
            })(place, this);
        });
    };

    this.getPlaceDetail = function(place) {
        placeDetail.objDetail(place.placeId, mapView.openInfoWindow);
    };
    this.animateAsociateMarker = function(place) {
        mapView.bouncingMarker(place.placeId);
    };
    this.stopMarkerAnimation = function() {
        mapView.stopBouncingMarker();
    };
    this.removePlace = function(place) {
        if (!confirm(`Do you want delete ${place.name}`)) {
            return;
        };
        mapView.removeMarkerMap(place.placeId);
        placesViewModel.myPlaces.remove((myplace) => { return myplace.placeId === place.placeId });
    };
    this.showMoreInfo = function(place) {
        request.moreInfo(place, function(requestedPlaceObj) {
            placesViewModel.openPlace(requestedPlaceObj);
        });
    };

    this.resetOpenPlace = function() {
        placesViewModel.openPlace(undefined);
    };
};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);