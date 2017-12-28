placeDetail = (function() {
    const autoCompleteInput = document.getElementById('input-new-Place');
    const placesDetailHash = {};
    let service;
    let requestOpt;
    let autocomplete;

    function init(map) {
        service = new google.maps.places.PlacesService(map);
        autocomplete = new google.maps.places.Autocomplete(autoCompleteInput);
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', function() {
            const placeResult = autocomplete.getPlace();
            addObjDetailHash(setFormat(placeResult));
            placesViewModel.createPlace(undefined, placeResult);
        });
    };

    function searchDetail(placeId, doneCallback) {
        let objDetail = placesDetailHash[placeId];
        if (objDetail) {
            doneCallback(undefined, objDetail);
            return;
        };
        service.getDetails({
            placeId: placeId
        }, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                doneCallback(status, undefined);
                return;
            }
            objDetail = setFormat(result);
            doneCallback(undefined, objDetail);
        });
    };

    function addObjDetailHash(objDetail) {
        placesDetailHash[objDetail.placeId] = objDetail;
    };

    function searchText(text, doneCallback) {
        service.textSearch({
            query: text
        }, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                doneCallback(status, undefined);
                return;
            };
            doneCallback(undefined, result[0]);
        });
    };

    function setFormat(result) {
        const objDetail = {
            placeId: result.place_id,
            name: result.name ? result.name : "No name available",
            address: result.formatted_address ? result.formatted_address : "No address available",
            phoneNumber: result.formatted_phone_number ? result.formatted_phone_number : "No phone number available",
            rating: result.rating ? result.rating : "No raiting available",
            types: result.types,
            url: result.url ? result.url : "#",
            openNow: result.opening_hours ? result.opening_hours.open_now : "No information available",
        };
        addObjDetailHash(objDetail);
        return objDetail;
    }

    return {
        init: init,
        searchDetail: searchDetail,
        searchText: searchText
    };

})();