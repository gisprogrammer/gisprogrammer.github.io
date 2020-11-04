var map = null;
var polygon = null;

function load() {
    map = L.map('mapa').setView([52, 19], 6);
    L.tileLayer('https://mapy.geoportal.gov.pl/wss/ext/OSM/BaseMap/tms/1.0.0/osm_3857/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png', {
        tms: true,
        zoomOffset: -1,
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var wmsLayer = L.tileLayer.wms('https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow', {
        layers: 'geoportal,dzialki,numery_dzialek,budynki', format: 'image/png', transparent: true,
    }).addTo(map);
    window.osmMap = map;
}

function addPolygon(points) {
    var gPoints = new Array();
    var _p = points.split(',');
    var cX = 0, cY = 0;
    var p0 = null;
    var gPoints2 = new Array();
    var xMin = 1000, yMin = 1000, xMax = -1000, yMax = -1000;
    for (var i = 0; i < _p.length; i++) {
        var point = _p[i].split(' ');
        if (p0 == null) p0 = point;
        cX += parseFloat(point[0]);
        cY += parseFloat(point[1]);
        xMin = Math.min(xMin, point[0]);
        xMax = Math.max(xMax, point[0]);
        yMin = Math.min(yMin, point[1]);
        yMax = Math.max(yMax, point[1]);
        gPoints.push(new Array(point[1], point[0]));
    }

    var center = new Array(cY / i, cX / i);
    if (polygon) polygon.remove();
    var bounds = L.latLngBounds(L.latLng(yMin, xMin), L.latLng(yMax, xMax));
    window.osmMap.fitBounds(bounds, { animate: false });
    polygon = L.polygon([gPoints], { showMeasurements: true }).addTo(window.osmMap);

}

function szukajDzialkiNew() {
    var w = document.getElementById('pole_szukaj_dzialki').value;

    if (w.length < 15 && w.search(' ') == -1) {
        alert("Podany teryt jest za krótki");
        return 0;
    }

    if (w != "") {
        advAJAX.post({
            url: "https://uldk.dzialkikatastralne.pl/index.php",
            parameters: { request: "GetParcelByIdOrNr", id: w, result: "id,numer,powiat,gmina,geom_wkt", srid: 4326 },
            onSuccess: function (obj) {

                var results = [];
                var lines = obj.responseText.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var fields = lines[i].split('|');
                    results[i] = [];
                    for (var j = 0; j < fields.length; j++) {
                        results[i][j] = fields[j];
                    }
                }
                // console.log(results);

                if (results[0][0] != -1) {
                    var tab = '<table class="wyniki"><tr><th>Identyfikator</th><th>Powiat</th><th>Gmina</th></tr>';
                    var licznik = 0;
                    for (var i = 1; i < results.length; i++) if (results[i][0]) {
                        licznik++;

                        geom = results[i][4];
                        if (geom) {
                            geom = geom.replace('SRID=4326;', '');
                            geom = geom.replace('POLYGON((', '');
                            geom = geom.replace('))', '');
                            geom = geom.replace('\r', '');
                            tab += '<tr class="wyniki_tr" onclick="addPolygon(\'' + geom + '\');"> \
                    <td>'+ results[i][0] + '</td> \
                    <td>'+ results[i][2] + '</td> \
                    <td>'+ results[i][3] + '</td> \
                    </tr>';
                        }
                    }
                    tab += '</table>';
                    addPolygon(geom);

                    document.getElementById('wyniki').innerHTML = tab;
                } else {
                    alert('Działka o podanym identyfikatorze nie została odnaleziona');
                }
            }
        });
    }
}

function onkeyszukajdzialki(evt) {
    var keyCode = null;
    if (evt.which) {
        keyCode = evt.which;
    } else
        if (evt.keyCode) {
            keyCode = evt.keyCode;
        } if (13 == keyCode) {
            szukajDzialkiNew();
        }
}
