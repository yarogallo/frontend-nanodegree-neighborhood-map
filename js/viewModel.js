const ViewModel = function() {
    const self = this;
    const listMenu = document.getElementById('list-container');
    const infoContainer = document.getElementById('place-info-container');
    self.numberPlaces = 0;
    self.myPlaces = ko.observableArray([]);
    self.openPlace = ko.observable();
    self.inputPlace = ko.observable('');
    self.inputNewPlace = ko.observable(false);
    self.inputNewPlaceIsClose = ko.computed(() => { return !self.inputNewPlace(); }, self);
    self.inputNewPlaceValue = ko.observable('');


    self.init = function() {
        const map = mapView.init();
        placesDetail.init(map);
        places.MY_PLACES.forEach(place => {
            (function(place) {
                placesViewModel.addNewPlace(place);
            })(place);
        });
    };

    self.createPlace = function(err, result) {
        if (err) {
            window.alert('Please write tha place again');
            return;
        }
        const newPlace = {
            name: result.name,
            location: {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng()
            },
            placeId: result.place_id,
        };
        places.MY_PLACES.push(newPlace);
        placesViewModel.addNewPlace(newPlace);
    };

    self.addNewPlace = function(place) {
        place.number = ++self.numberPlaces;
        place.visibility = ko.observable(true);
        mapView.createMarkerMap(place);
        self.myPlaces.push(place);
    };

    self.showPlaceDetail = function(placeId) {
        placesDetail.searchDetail(placeId, mapView.openInfoWindowWithPlaceDetails);
    };
    self.handlePlaceClick = function(place) {
        self.showPlaceDetail(place.placeId);
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
        }
        mapView.removeMarkerMap(place.placeId);
        placesViewModel.myPlaces.remove((myplace) => { return myplace.placeId === place.placeId; });
        placesViewModel.numberPlaces--;
        placesViewModel.reorderNumbers(place.number);
        if (placesViewModel.openPlace() && (placesViewModel.openPlace().placeId === place.placeId)) placesViewModel.resetOpenPlace();
    };

    self.reorderNumbers = function(number) {
        for (let index = number - 1; index < self.myPlaces().length; index++) {
            place = self.myPlaces()[index];
            place.number--;
            mapView.reorderMarkers(place.placeId, place.number);
        }
    };

    self.showMoreInfo = function(place) {
        request.moreInfo(place, function(requestedPlaceObj) {
            if (!requestedPlaceObj.links.length && !requestedPlaceObj.photosUrl.length) {
                requestedPlaceObj.name += ' :Sorry!! No further information found :(';
            }
            placesViewModel.openPlace(requestedPlaceObj);
        });
    };

    self.resetOpenPlace = function() {
        placesViewModel.openPlace(undefined);
    };

    self.filterApply = function() {
        for (let index = 0; index < self.myPlaces().length; index++) {
            let place = self.myPlaces()[index];
            let str = place.name.substr(0, placesViewModel.inputPlace().length);
            if (str.toLocaleLowerCase() !== placesViewModel.inputPlace().toLocaleLowerCase()) {
                place.visibility(false);
                mapView.removeMarkerMap(place.placeId);
            } else {
                place.visibility(true);
                mapView.showMarkerMap(place.placeId);
            }
        }
    };

    self.showInputNewPlace = function() {
        self.inputNewPlace(true);
    };

    self.hideInputPlace = function() {
        self.inputNewPlace(false);
    };

    self.searchInputValue = function() {
        placesDetail.searchText(self.inputNewPlaceValue(), self.createPlace);
    };

    self.resetInputNewValue = function(str) {
        self.inputNewPlaceValue(str);
    };

    self.toggleMenu = function() {
        if (listMenu.classList.contains('outScreenX')) {
            window.requestAnimationFrame(function() {
                listMenu.classList.remove('outScreenX');
            });
            return;
        }
        window.requestAnimationFrame(function() {
            listMenu.classList.add('outScreenX');
        });

    };

};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);