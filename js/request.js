request = (function() {
    const requestedPlacesHash = {};

    function moreInfo(place, doneCallback) {
        const obj = {};
        if (requestedPlacesHash[place.placeId]) {
            doneCallback(requestedPlacesHash[place.placeId]);
            return;
        };
        obj.name = place.name;
        obj.placeId = place.placeId;
        makeHttpRequest(getWikiUrl(place.name), function(status, response) {

            obj.links = status !== 200 ? [] : JSON.parse(response)[3];

            makeHttpRequest(getFlickerUrl(place.name, place.location), function(status, response) {
                obj.photosUrl = status !== 200 ? [] : getUrlPhotos(response);
                doneCallback(obj);
            });
        });
    };

    function makeHttpRequest(url, doneCallback) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                doneCallback(this.status, this.responseText);
            };
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    };

    function getFlickerUrl(placeName, location) {
        const key = 'd4cd83c196005f3d68c38be13ea02cd2';
        const lat = location.lat;
        const lon = location.lng;
        return `https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=${key}&per_page=10&nojsoncallback=1&lat=${lat}&lon=${lon}&tags=${placeName} `;
    };

    function getWikiUrl(placeName) {
        return `https://en.wikipedia.org//w/api.php?action=opensearch&format=json&origin=*&search=${placeName}&limit=10`;
    }

    function getUrlPhotos(response) {
        const photos = [];
        const rsp = JSON.parse(response);
        if (rsp.stat !== 'ok') {
            return null;
        };
        rsp.photos.photo.forEach((photo) => {
            photos.push("http://farm" + photo.farm + ".static.flickr.com/" +
                photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg");
        });
        return photos;
    };
    return {
        moreInfo: moreInfo
    }
})();