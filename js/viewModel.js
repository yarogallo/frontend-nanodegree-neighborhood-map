const ViewModel = function() {
    const self = this;
    const listMenu = document.getElementById('list-container');
    const infoContainer = document.getElementById('place-info-container');
    const reorderNumbers = (number) => {
        for (let index = number - 1; index < self.myPlaces().length; index++) {
            place = self.myPlaces()[index];
            place.number--;
            mapView.reorderMarkers(place.placeId, place.number);
        }
    };
    const resetInputNewValue = (str) => { self.inputNewPlaceValue(str); };
    const addToMyPlaces = (place) => {
        place.number = self.myPlaces().length + 1;
        place.visibility = ko.observable(true);
        mapView.createMarkerMap(place);
        self.myPlaces.push(place);
    };
    const toggleOutScreen = (elem, doneCallback) => {
        window.requestAnimationFrame(() => { elem.classList.toggle('outScreenX'); });
        if (doneCallback) window.setTimeout(doneCallback, 2000);
    };

    self.myPlaces = ko.observableArray([]);
    self.openPlace = ko.observable();
    self.inputText = ko.observable('');
    self.inputNewPlace = ko.observable(false);
    self.inputNewPlaceIsClose = ko.computed(() => { return !self.inputNewPlace(); }, self);
    self.inputNewPlaceValue = ko.observable('');

    self.init = () => {
        const map = mapView.init();
        placesService.init(map);
        places.MY_PLACES.forEach(place => {
            ((place) => { addToMyPlaces(place); })(place);
        });
    };

    self.toggleMenuHandler = () => {
        toggleOutScreen(listMenu);
    };

    self.filterPlacesHandler = () => {
        for (let index = 0; index < self.myPlaces().length; index++) {
            let place = self.myPlaces()[index];
            let str = place.name.substr(0, self.inputText().length);
            if (str.toLocaleLowerCase() !== self.inputText().toLocaleLowerCase()) {
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
        if (self.openPlace() && (self.openPlace().placeId === place.placeId)) self.resetOpenPlaceHandler();
        reorderNumbers(place.number);
    };

    self.showMoreInfoHandler = (place) => {
        placesService.getMoreInfo(place, (infoObj) => {
            infoObj.name = place.name;
            if (!infoObj.links.length && !infoObj.photosUrl.length) infoObj.name += ' :Sorry!! No further information found :(';
            infoObj.placeId = place.placeId;
            if (!self.openPlace()) toggleOutScreen(infoContainer);
            self.openPlace(infoObj);
        });
    };

    self.placeClickHandler = (place) => { self.showPlaceDetail(place.placeId); };

    self.placeMouseoverHandler = (place) => { mapView.animateMarker(place.placeId); };

    self.placeMouseoutHandler = () => { mapView.stopMarkerAnimation(); };

    self.hideInputHandler = () => { self.inputNewPlace(false); };

    self.showInputHandler = () => { self.inputNewPlace(true); };

    self.searchValueHandler = () => {
        if (!self.inputNewPlaceValue()) return;
        placesService.searchText(self.inputNewPlaceValue(), self.createPlace);
    };

    self.resetOpenPlaceHandler = () => {
        toggleOutScreen(infoContainer, () => {
            self.openPlace(undefined);
        });
    };

    self.createPlace = (result) => {
        resetInputNewValue('');
        if (!result) {
            window.alert('Please write the place again');
            return;
        }
        const place = places.createNewPlace(result.name, result.place_id, result.geometry.location.lat(), result.geometry.location.lng());
        addToMyPlaces(place);
    };

    self.showPlaceDetail = (placeId) => { placesService.searchDetail(placeId, mapView.openInfoWindowWithPlaceDetails); };

};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);