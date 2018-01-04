const ViewModel = function() {
    const self = this;
    const listMenu = document.getElementById('list-container');
    const infoContainer = document.getElementById('place-info-container');
    const reorderNumbers = (number) => { //Each time a place is removed, reorder places and markers numbers  
        for (let index = number - 1; index < self.myPlaces().length; index++) {
            place = self.myPlaces()[index];
            place.number--;
            mapView.changeMarkerLabel(place.placeId, place.number);
        }
    };
    const resetInputNewValue = (str) => { self.inputNewPlaceValue(str); }; //Put value lower input to specific string
    const addToMyPlaces = (place) => { //Given a place add it to myPlaces observable array with two new properties number and visibility
        place.number = self.myPlaces().length + 1;
        place.visibility = ko.observable(true);
        mapView.createMarkerMap(place);
        self.myPlaces.push(place);
    };
    const toggleOutScreen = (elem, doneCallback) => { //Toggle an element in or out of the screen, ejecute callback if there is any
        window.requestAnimationFrame(() => { elem.classList.toggle('outScreenX'); });
        if (doneCallback) window.setTimeout(doneCallback, 2000);
    };

    self.myPlaces = ko.observableArray([]); //places to show 
    self.openPlace = ko.observable(); //place was clicked for further information 
    self.inputText = ko.observable(''); // Upper input text input
    self.inputNewPlaceVisible = ko.observable(false); // Visibility lower input, initial value hidden
    self.inputNewPlaceValue = ko.observable(''); // Lower input value

    self.init = () => {
        const map = mapView.init();
        placesService.init(map);
        places.MY_PLACES.forEach(place => { //Add places to myPlaces observable array
            ((place) => { addToMyPlaces(place); })(place);
        });
    };

    self.toggleMenuHandler = () => { toggleOutScreen(listMenu); }; //Call toggleOutScreen to toggle listMenu in and out of the screen 

    self.filterPlacesHandler = () => { //Filter places names and markers, each time the user write in the upper input
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

    self.removePlaceHandler = (place) => { //Remove a place from myPlaces observable array and remove the marker that reperesents the place from the map
        if (!confirm(`Do you want delete ${place.name}`)) return;
        mapView.removeMarkerMap(place.placeId);
        self.myPlaces.remove((myplace) => { return myplace.placeId === place.placeId; });
        if (self.openPlace() && (self.openPlace().placeId === place.placeId)) self.resetOpenPlaceHandler();
        reorderNumbers(place.number);
    };

    self.placeClickHandler = (place) => { //Ask to placesServices for related links and photos(further info) and show update openPlace
        placesService.getMoreInfo(place, (infoObj) => {
            self.showPlaceDetail(place.placeId);
            infoObj.name = place.name;
            infoObj.placeId = place.placeId;
            if (!infoObj.links.length && !infoObj.photosUrl.length) infoObj.name += ' :Sorry!! No further information found :(';
            if (!self.openPlace()) toggleOutScreen(infoContainer);
            self.openPlace(infoObj);
        });
    };

    self.placeMouseoverHandler = (place) => { mapView.animateMarker(place.placeId); }; //Animate corresponding marker when mouse is over a place 

    self.placeMouseoutHandler = () => { mapView.stopMarkerAnimation(); }; //Stop marker animation when mouse is out the place

    self.toggleInputHandler = () => { self.inputNewPlaceVisible(!self.inputNewPlaceVisible()); }; //Change inputNewPlaceVisible value, switch lower input visibility

    self.searchValueHandler = () => { // If the user do no pick a place from the autocomplete, this handle when add button is pressed
        if (!self.inputNewPlaceValue()) return;
        placesService.searchText(self.inputNewPlaceValue(), self.createPlace);
    };

    self.resetOpenPlaceHandler = () => { //Call toggleOutScreen for Toggle infoContainer in and out of the screen
        toggleOutScreen(infoContainer, () => {
            self.openPlace(undefined);
        });
    };

    self.createPlace = (result) => { //When add button is clicked a new place is created and to add myPlaces if it is possible
        resetInputNewValue('');
        if (!result) {
            window.alert('Please write the place again');
            return;
        }
        const place = places.createNewPlace(result.name, result.place_id, result.geometry.location.lat(), result.geometry.location.lng());
        addToMyPlaces(place);
    };

    self.showPlaceDetail = (placeId) => { placesService.searchDetail(placeId, mapView.openInfoWindowWithPlaceDetails); }; //request placesService about details using placeId and open infoWindow

};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);