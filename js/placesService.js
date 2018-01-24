placesService = (function() {
    const DEFAULT_STR = "Not available";
    const autoCompleteInput = document.getElementById('input-new-Place');
    const infoHash = {}; //Hash for all info requested(detail, related links, related photos url)
    let service;
    let autocomplete;

    const createHashObj = (placeId) => {
        infoHash[placeId] = {
            detail: null,
            moreInfo: {}
        };
        return infoHash[placeId];
    };

    const setFormat = (result) => { //Using search detail result, create detail object
        return {
            placeId: result.place_id,
            name: result.name ? result.name : DEFAULT_STR,
            address: result.formatted_address ? result.formatted_address : DEFAULT_STR,
            phoneNumber: result.formatted_phone_number ? result.formatted_phone_number : DEFAULT_STR,
            rating: result.rating ? result.rating : DEFAULT_STR,
            types: result.types,
            url: result.url ? result.url : "#",
            openNow: result.opening_hours ? result.opening_hours.open_now : DEFAULT_STR,
        };
    };

    const getRequest = (url) => {
        return fetch(url).then((response) => {
            if (response.status !== 200) {
                console.log('Error Status: ' + response.status);
                return Promise.reject(null);
            }
            return response.json();
        }).catch(function(err) {
            console.log('Error: ' + err);
            return Promise.reject(null);
        });
    };



    const getFlickerUrl = (placeName, location) => {
        const key = 'd4cd83c196005f3d68c38be13ea02cd2';
        const lat = location.lat;
        const lon = location.lng;
        return `https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=${key}&per_page=6&nojsoncallback=1&lat=${lat}&lon=${lon}&tags=${placeName} `;
    };

    const getWikiUrl = (placeName) => {
        return `https://en.wikipedia.org//w/api.php?action=opensearch&format=json&origin=*&search=${placeName}&limit=5`;
    };

    const getUrlPhotos = (response) => { //Using flicker response, create correct url
        const photos = [];
        const rsp = response;
        rsp.photos.photo.forEach((photo) => {
            photos.push("http://farm" + photo.farm + ".static.flickr.com/" +
                photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg");
        });
        return photos;
    };

    return {
        init: function(map) {
            service = new google.maps.places.PlacesService(map);
            autocomplete = new google.maps.places.Autocomplete(autoCompleteInput);
            autocomplete.bindTo('bounds', map);
            autocomplete.addListener('place_changed', () => {
                placesViewModel.createPlace(autocomplete.getPlace());
            });
        },
        searchDetail: function(placeId, doneCallback) { //Search place detail using google place api, ejecut doneCallback when finish. 
            let obj = infoHash[placeId];
            if (!obj) obj = createHashObj(placeId);
            if (obj.detail) {
                doneCallback(obj.detail);
                return;
            }
            service.getDetails({
                placeId: placeId
            }, function(result, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    doneCallback(undefined);
                    return;
                }
                obj.detail = setFormat(result);
                doneCallback(obj.detail);
            });
        },

        searchText: function(text, doneCallback) { // Search a place by text using google place api, ejecute doneCallback when finish
            service.textSearch({
                query: text
            }, function(result, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    doneCallback(undefined);
                    return;
                }
                doneCallback(result[0]);
            });
        },

        getMoreInfo: function(place, doneCallback) { //Get wiki list of a place related links and flicker related photos, doneCallback when finish
            let obj = infoHash[place.placeId];
            let wikiUrl = getWikiUrl(place.name);
            let flickerUrl = getFlickerUrl(place.name, place.location);
            if (obj) {
                doneCallback(obj.moreInfo);
                return;
            }
            obj = createHashObj(place.placeId);
            getRequest(wikiUrl)
                .then(response => {
                    obj.moreInfo.links = response[3];
                }, err => {
                    obj.moreInfo.links = [];
                })
                .then(
                    getRequest(flickerUrl)
                    .then(response => {
                        obj.moreInfo.photosUrl = getUrlPhotos(response);
                    }, err => {
                        obj.moreInfo.photosUrl = [];
                    }).then(() => {
                        doneCallback(obj.moreInfo);
                    })
                );
        }
    };
})();