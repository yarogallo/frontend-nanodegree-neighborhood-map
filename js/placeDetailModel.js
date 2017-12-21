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
        }

        requestOpt = {
            placeId: placeId
        };
        service.getDetails(requestOpt, function(results, status) {
            if (!status === google.maps.places.PlacesServiceStatus.OK) {
                doneCallback(status, undefined);
                return;
            }
            objDetail = detailObjFormatted(results);
            addObjDetailHash(objDetail, placeId);
            doneCallback(undefined, objDetail);
            console.log(placesDetailHash);
        });
    };

    function detailObjFormatted(result) {
        const placeDetailObj = {};
        placeDetailObj.placeId = result.place_id;
        placeDetailObj.name = result.name ? result.name : "No name available";
        placeDetailObj.address = result.formatted_address ? result.formatted_address : "No address available";
        placeDetailObj.phoneNumber = result.formatted_phone_number ? result.formatted_phone_number : "No phone number available";
        placeDetailObj.rating = result.rating ? result.rating : "No raiting available";
        placeDetailObj.types = result.types;
        placeDetailObj.url = result.url ? result.url : "#";
        placeDetailObj.openNow = result.opening_hours ? result.opening_hours.open_now : "No information available";
        return placeDetailObj;
    };

    function addObjDetailHash(searchResult, placeId) {
        placesDetailHash[placeId] = searchResult;
    };
    return {
        init: init,
        getPlaceObjDetails: getPlaceObjDetails,
    };

})();