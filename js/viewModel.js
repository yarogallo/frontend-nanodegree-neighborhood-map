const ViewModel = function() {
    let self = this;
    self.myPlaces = ko.observableArray([]);
    self.openPlace = ko.observable(null);
    self.filterPlaces = function(place) { console.log(place) };

    self.init = function() {
        self.map = mapView.init();
        placeDetailModel.init(self.map);
        placesModel.MY_PLACES.forEach(place => {
            (function(place) {
                mapView.setMarkerMap(place);
                self.myPlaces.push(place);
            })(place);
        });
    };

    self.openAsociateInfoWindow = function(place) {
        self.getPlaceDetails(place.placeId, mapView.openInfoWindow);
    };
    self.animateAsociateMarker = function(place) {
        mapView.bouncingMarker(place.placeId);
    };
    self.stopMarkerAnimation = function() {
        mapView.stopBouncingMarker();
    };
    self.removePlace = function(place) {
        if (!confirm(`Do you want delete ${place.name}`)) {
            return;
        };
        mapView.removeMarkerMap(place.placeId);
        self.myPlaces.remove((myplace) => { return myplace.placeId === place.placeId });
    };
};

ViewModel.prototype.getPlaceDetails = function(placeId, doneCall) {
    placeDetailModel.getPlaceObjDetails(placeId, doneCall);
};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);