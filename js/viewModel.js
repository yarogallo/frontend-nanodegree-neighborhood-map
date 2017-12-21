const ViewModel = function() {
    let self = this;
    self.myPlaces = ko.observableArray([]);
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
};

ViewModel.prototype.requestPlaceDetail = function(marker, doneCallback) {
    placeDetailModel.getPlaceObjDetails(marker.id, (err, result) => {
        let infoHTML;
        if (err) {
            infoHTML = `<div><h3>an error has occurr ${err}</h3></div>`;
        } else {
            infoHTML = '<div class="infoContent text-black" >' +
                '<div><p class="fontawesome-heart"><strong>Name:</strong> ' + result.name + '</p></div>' +
                '<div><p class="fontawesome-map-marker"><strong>Address: </strong>' + result.address + '</p></div>' +
                '<div><p class="fontawesome-phone"><strong>Phone number: </strong>' + result.phoneNumber + '</p></li>' +
                '<div><p><strong class="fontawesome-thumbs-up">Raiting: </strong>' + result.rating + '</p></div>' +
                '<div><p><strong class="fontawesome-link" target="_blank">Url: </strong><a href="' + result.url + '">Find me here</a></p></li>' +
                '<div><p class="fontawesome-calendar"><strong>Open Now: </strong>' + result.openNow + '</p></div>' +
                '</div>';
        };
        doneCallback(marker, infoHTML);
    });

};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);