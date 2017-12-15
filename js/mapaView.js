const mapView = (function(global) {
    const mapCont = document.getElementById('map');
    let map;

    function initMap(params) {
        const mapOptions = {
            center: { lat: 37.7749, lng: -122.4194 },
            zoom: 12
        }
        map = new google.maps.Map(mapCont, mapOptions);
    };

    global.map = {
        initMap: initMap,
    };
})(this);