const ViewModel = function() {

    this.myPlaces = ko.observableArray([]);
    this.openPlace = ko.observable();
    this.letters = ko.observable('');

    this.init = function() {
        const map = mapView.init();
        placeDetail.init(map);
        places.MY_PLACES.forEach(place => {
            (function(place, vm) {
                place.visibility = ko.observable(true);
                mapView.createMarkerMap(place);
                vm.myPlaces.push(place);
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
        if (placesViewModel.openPlace().placeId === place.placeId) placesViewModel.resetOpenPlace();
    };
    this.showMoreInfo = function(place) {
        request.moreInfo(place, function(requestedPlaceObj) {
            placesViewModel.openPlace(requestedPlaceObj);
        });
    };
    this.resetOpenPlace = function() {
        placesViewModel.openPlace(undefined);
    };

    this.filterApply = function() {
        for (let index = 0; index < placesViewModel.myPlaces().length; index++) {
            let place = placesViewModel.myPlaces()[index];
            let str = place.name.substr(0, placesViewModel.letters().length);
            if (str.toLocaleLowerCase() != placesViewModel.letters().toLocaleLowerCase()) {
                place.visibility(false);
                mapView.removeMarkerMap(place.placeId);
            } else {
                place.visibility(true);
                mapView.showMarkerMap(place.placeId);
            };

        };
    };
};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);