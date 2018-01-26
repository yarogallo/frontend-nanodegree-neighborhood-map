const ViewModel = function() {
    const self = this;
    const resetInputNewValue = (str) => { self.inputNewPlaceValue(str); }; //Put value lower input to specific string
    const reorderNumbers = (number) => { //Each time a place is removed, reorder places and markers numbers  
        for (let index = number - 1; index < self.myPlaces().length; index++) {
            let place = self.myPlaces()[index];
            place.number--;
            place.marker.set('label', place.number.toString());
        }
    };
    const addToMyPlaces = (place) => { //Given a place add it to myPlaces observable array with two new properties number and visibility
        place.number = self.myPlaces().length + 1;
        place.visibility = ko.observable(true);
        self.myPlaces.push(place);
    };

    self.myPlaces = ko.observableArray([]); //places to show 
    places.MY_PLACES.forEach(place => { //Add places to myPlaces observable array
        ((place) => { addToMyPlaces(place); })(place);
    });
    self.visibleMenu = ko.observable(false);
    self.openPlace = ko.observable(); //place was clicked for further information 
    self.infoContainer = ko.observable(true);
    self.inputText = ko.observable(''); // Upper input text input
    self.inputNewPlaceVisible = ko.observable(false); // Visibility lower input, initial value hidden
    self.inputNewPlaceValue = ko.observable(''); // Lower input value

    self.init = () => {
        const map = mapView.init();
        placesService.init(map);
        self.myPlaces().forEach((place) => { place.marker = mapView.createMarkerMap(place); });
    };
    self.mapErrHandler = () => { window.alert('Sorry!! We are having problems with Google Maps API, please try later'); };

    self.toggleMenuHandler = () => { self.visibleMenu(!self.visibleMenu()); }; //Call toggleOutScreen to toggle listMenu in and out of the screen 

    self.filterPlacesHandler = () => { //Filter places names and markers, each time the user write in the upper input
        mapView.closeInfoWindow();
        self.infoContainer(true);
        for (let index = 0; index < self.myPlaces().length; index++) {
            let place = self.myPlaces()[index];
            let currentInputText = self.inputText().toLocaleLowerCase();
            let str = place.name.substr(0, currentInputText.length);
            if (!str.toLocaleLowerCase().includes(currentInputText)) {
                place.visibility(false);
                place.marker.setVisible(false);
            } else {
                place.visibility(true);
                place.marker.setVisible(true);
            }
        }
    };

    self.removePlaceHandler = (place) => { //Remove a place from myPlaces observable array and remove the marker that reperesents the place from the map
        if (!confirm(`Do you want delete ${place.name}`)) return;
        place.marker.setMap(null);
        self.myPlaces.remove((myplace) => { return myplace.placeId === place.placeId; });
        if (self.openPlace() && (self.openPlace().placeId === place.placeId)) self.resetOpenPlaceHandler();
        reorderNumbers(place.number);
    };

    self.placeClickHandler = (place) => { //Ask to placesServices for related links and photos(further info) and show update openPlace
        self.showPlaceDetail(place.marker);
        mapView.animateMarker(place.marker);
        placesService
            .getMoreInfo(place).then(response => {
                if (!response.links.length && !response.photosUrl.length) {
                    response.name += ' :Sorry!! No further information found :(';
                }
                self.openPlace(response);
                self.infoContainer(false);
            });
    };

    // Change inputNewPlaceVisible value, switch lower input visibility
    self.toggleInputHandler = () => {
        self.inputNewPlaceVisible(!self.inputNewPlaceVisible());
    };

    self.searchValueHandler = () => { // If the user do no pick a place from the autocomplete, this handle when add button is pressed
        if (!self.inputNewPlaceValue()) return;
        placesService.searchText(self.inputNewPlaceValue())
            .then(response => { self.createPlace(response); }, err => { window.alert('Please write the place again'); });
    };

    self.resetOpenPlaceHandler = () => { //Call toggleOutScreen for Toggle infoContainer in and out of the screen
        self.infoContainer(true);
        window.setTimeout(() => {
            self.openPlace(undefined);
        }, 1000);
    };

    self.createPlace = (result) => { //When add button is clicked a new place is created and to add myPlaces if it is possible
        resetInputNewValue('');
        const place = {
            name: result.name,
            placeId: result.place_id,
            location: {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng()
            },
        };
        addToMyPlaces(place);
        place.marker = mapView.createMarkerMap(place);
    };

    self.showPlaceDetail = (marker) => {
        placesService.searchDetail(marker.placeId).then((objDetail) => { mapView.openInfoWindowWithPlaceDetails(marker, objDetail); });
    };
};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);