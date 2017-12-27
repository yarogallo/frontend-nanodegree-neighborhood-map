const ViewModel = function() {
    let self = this;
    self.myPlaces = ko.observableArray([]);
    self.openPlace = ko.observable();

    self.init = function() {
        self.map = mapView.init();
        placeDetail.init(self.map);
        places.MY_PLACES.forEach(place => {
            (function(place) {
                mapView.setMarkerMap(place);
                self.myPlaces.push(place);
            })(place);
        });
    };

    self.getPlaceDetail = function(place) {
        placeDetail.objDetail(place.placeId, mapView.openInfoWindow);
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
    self.showMoreInfo = function(place) {
        let obj = {};

        request.wikiLinks(place, function(listWikiLinks) {
            console.log(listWikiLinks);
            obj.links = listWikiLinks;
            obj.name = place.name;
        });

        request.flickerPhotos(place, function(listPhotosUrl) {
            obj.photos = listPhotosUrl;
            self.openPlace(obj);
        });

    };

    self.resetOpenPlace = function() {
        self.openPlace(undefined);
    };
};

placesViewModel = new ViewModel();
ko.applyBindings(placesViewModel);