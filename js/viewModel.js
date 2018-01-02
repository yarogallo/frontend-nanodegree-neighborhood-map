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

    self.init = () => {
        const map = mapView.init();
        placesService.init(map);
        places.MY_PLACES.forEach(place => {
            ((place) => { placesViewModel.addNewPlace(place); })(place);
        });
    };

    self.toggleMenuHandler = () => {
        if (listMenu.classList.contains('outScreenX')) {
            window.requestAnimationFrame(() => { listMenu.classList.remove('outScreenX'); });
            return;
        }
        window.requestAnimationFrame(() => { listMenu.classList.add('outScreenX'); });
    };

    self.filterPlacesHandler = () => {
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

    self.removePlaceHandler = (place) => {
        if (!confirm(`Do you want delete ${place.name}`)) return;
        mapView.removeMarkerMap(place.placeId);
        self.myPlaces.remove((myplace) => { return myplace.placeId === place.placeId; });
        self.numberPlaces--;
        self.reorderNumbers(place.number);
        if (self.openPlace() && (self.openPlace().placeId === place.placeId)) placesViewModel.resetOpenPlace();
    };

    self.showMoreInfoHandler = (place) => {
        placesService.getMoreInfo(place, (infoObj) => {
            if (!infoObj.links.length && !infoObj.photosUrl.length) infoObj.name = ' :Sorry!! No further information found :(';
            infoObj.name = place.name;
            infoObj.placeId = place.placeId;
            self.openPlace(infoObj);
        });
    };

    self.placeClickHandler = (place) => { self.showPlaceDetail(place.placeId); };

    self.placeMouseoverHandler = (place) => { mapView.animateMarker(place.placeId); };

    self.placeMouseoutHandler = () => { mapView.stopMarkerAnimation(); };

    self.hideInputHandler = () => { self.inputNewPlace(false); };

    self.showInputHandler = () => { self.inputNewPlace(true); };

    self.searchValueHandler = () => { placesService.searchText(self.inputNewPlaceValue(), self.createPlace); };

    self.resetOpenPlaceHandler = () => { placesViewModel.openPlace(undefined); };


    self.createPlace = (result) => {
        if (!result) {
            window.alert('Please write the place again');
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
        self.addNewPlace(newPlace);
    };

    self.addNewPlace = (place) => {
        place.number = ++self.numberPlaces;
        place.visibility = ko.observable(true);
        mapView.createMarkerMap(place);
        self.myPlaces.push(place);
    };

    self.reorderNumbers = (number) => {
        for (let index = number - 1; index < self.myPlaces().length; index++) {
            place = self.myPlaces()[index];
            place.number--;
            mapView.reorderMarkers(place.placeId, place.number);
        }
    };

    self.resetInputNewValue = function(str) { self.inputNewPlaceValue(str); };

    self.showPlaceDetail = (placeId) => { placesService.searchDetail(placeId, mapView.openInfoWindowWithPlaceDetails) };

};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);