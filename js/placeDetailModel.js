placeDetailModel = (function() {
    const placesDetailHash = {};
    let service;
    let requestOpt;

    function init(map) {
        service = new google.maps.places.PlacesService(map);
    };

    function getPlaceObjDetails(placeId, doneCallback) {
        let objDetail = placesDetailHash[placeId];
        if (objDetail) {
            doneCallback(undefined, objDetail);
            return;
        };
        service.getDetails({
            placeId: placeId
        }, function(result, status) {
            if (!status === google.maps.places.PlacesServiceStatus.OK) {
                doneCallback(status, undefined);
                return;
            }
            objDetail = {
                placeId: result.place_id,
                name: result.name ? result.name : "No name available",
                address: result.formatted_address ? result.formatted_address : "No address available",
                phoneNumber: result.formatted_phone_number ? result.formatted_phone_number : "No phone number available",
                rating: result.rating ? result.rating : "No raiting available",
                types: result.types,
                url: result.url ? result.url : "#",
                openNow: result.opening_hours ? result.opening_hours.open_now : "No information available",
            };
            addObjDetailHash(objDetail, placeId);
            doneCallback(undefined, objDetail);
        });
    };

    function addObjDetailHash(searchResult, placeId) {
        placesDetailHash[placeId] = searchResult;
    };
    return {
        init: init,
        getPlaceObjDetails: getPlaceObjDetails,
    };

})();