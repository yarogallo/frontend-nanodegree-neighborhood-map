const ViewModel = function() {
    const listMenu = document.getElementById('list-container');
    this.myPlaces = ko.observableArray([]);
    this.openPlace = ko.observable();
    this.textInput = ko.observable('');
    this.inputNewPlace = ko.observable(false);
    this.inputNewPlaceIsClose = ko.computed(function() {
        return !this.inputNewPlace();
    }, this);
    this.inputNewPlaceValue = ko.observable();


    this.init = function() {
        console.log(this);
        const map = mapView.init();
        placesDetail.init(map);
        places.MY_PLACES.forEach(place => {
            (function(place) {
                placesViewModel.addNewPlace(place);
            })(place);
        });
    };

    this.createPlace = function(err, result) {
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
            placeId: result.place_id
        };
        places.MY_PLACES.push(newPlace);
        placesViewModel.addNewPlace(newPlace);
    };

    this.addNewPlace = function(place) {
        place.visibility = ko.observable(true);
        mapView.createMarkerMap(place);
        this.myPlaces.push(place);
    };

    this.getPlaceDetail = function(place) {
        placesDetail.searchDetail(place.placeId, mapView.openInfoWindow);
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
        }
        mapView.removeMarkerMap(place.placeId);
        placesViewModel.myPlaces.remove((myplace) => { return myplace.placeId === place.placeId; });
        if (placesViewModel.openPlace() && (placesViewModel.openPlace().placeId === place.placeId)) placesViewModel.resetOpenPlace();
    };
    this.showMoreInfo = function(place) {
        request.moreInfo(place, function(requestedPlaceObj) {
            if (!requestedPlaceObj.links.length && !requestedPlaceObj.photosUrl.length) {
                requestedPlaceObj.name += ' :Sorry!! further information found :(';
            }
            placesViewModel.openPlace(requestedPlaceObj);
        });
    };
    this.resetOpenPlace = function() {
        placesViewModel.openPlace(undefined);
    };

    this.filterApply = function() {
        for (let index = 0; index < this.myPlaces().length; index++) {
            let place = this.myPlaces()[index];
            let str = place.name.substr(0, placesViewModel.textInput().length);
            if (str.toLocaleLowerCase() !== placesViewModel.textInput().toLocaleLowerCase()) {
                place.visibility(false);
                mapView.removeMarkerMap(place.placeId);
            } else {
                place.visibility(true);
                mapView.showMarkerMap(place.placeId);
            }
        }
    };

    this.showInputNewPlace = function() {
        this.inputNewPlace(true);
    };

    this.hideInputPlace = function() {
        this.inputNewPlace(false);
    };

    this.searchInputValue = function() {
        placesDetail.searchText(this.inputNewPlaceValue(), this.createPlace);
        this.resetInputNewValue('');
    };

    this.resetInputNewValue = function(str) {
        this.inputNewPlaceValue(str);
    };

    this.toggleMenu = function() {
        if (listMenu.classList.contains('outScreen')) {
            window.requestAnimationFrame(function() {
                listMenu.classList.remove('outScreen');
            });
            return;
        }
        window.requestAnimationFrame(function() {
            listMenu.classList.add('outScreen');
        });

    };

};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);