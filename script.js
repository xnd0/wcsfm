// --------------------------------- \\
// -------- Javascript Page -------- \\
// --------------------------------- \\


const AddTestMarker = document.querySelector('#addtestmarker')
const RemoveTestMarker = document.querySelector('#removetestmarker')

const GetFireData = document.querySelector('#getfiredata')
const LogFireData = document.querySelector('#logfiredata')

const RepoMapWestCoast = document.querySelector('#repomapwestcoast')
const RepoMapSeattle = document.querySelector('#repomapseattle')
const RepoMapPDX = document.querySelector('#repomappdx')
const RepoMapSF = document.querySelector('#repomapsf')
const RepoMapLA = document.querySelector('#repomapla')

const loaderContainer = document.querySelector('.loader-container');

// -----v----v----v----v-----v----v----v----v----- \\
// ----- Start AQI Area ----- Start AQI Area ----- \\
// -----v----v----v----v-----v----v----v----v----- \\

let allMarkers = {};
 
function createMap() {
    var OpenStreetMap_Mapnik = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
    );
 
    let map = L.map(document.getElementById("map"), {
        attributionControl: false,
        gestureHandling: true,
        zoomSnap: 0.1,
    })
        .setView([0, 0], 12)
        .addLayer(OpenStreetMap_Mapnik);
 
    setTimeout(function () {
        map.on("moveend", () => {
            let bounds = map.getBounds();
            bounds =
                bounds.getNorth() +
                "," +
                bounds.getWest() +
                "," +
                bounds.getSouth() +
                "," +
                bounds.getEast();
            document.getElementById("leaflet-map-bounds").innerHTML =
                "bounds: " + bounds.split(",").join(", ");
 
            populateMarkers(map, bounds, true);
        });
    }, 1000);
 
    return map;
}
 
function populateMarkers(map, bounds, isRefresh) {
    return fetch(
        "https://api.waqi.info/v2/map/bounds/?latlng=" +
            bounds +
            "&token=" +
            token()
    )
        .then((x) => x.json())
        .then((stations) => {
            if (stations.status != "ok") throw stations.data;
 
            stations.data.forEach((station) => {
                if (allMarkers[station.uid])
                    map.removeLayer(allMarkers[station.uid]);
 
                let iw = 83,
                    ih = 107;
                let icon = L.icon({
                    iconUrl:
                        "https://waqi.info/mapicon/" + station.aqi + ".30.png",
                    iconSize: [iw / 2, ih / 2],
                    iconAnchor: [iw / 4, ih / 2 - 5],
                });
 
                let marker = L.marker([station.lat, station.lon], {
                    zIndexOffset: station.aqi,
                    title: station.station.name,
                    icon: icon,
                }).addTo(map);
 
                marker.on("click", () => {
                    let popup = L.popup()
                        .setLatLng([station.lat, station.lon])
                        .setContent(station.station.name)
                        .openOn(map);
 
                    getMarkerPopup(station.uid).then((info) => {
                        popup.setContent(info);
                    });
                });
 
                allMarkers[station.uid] = marker;
            });
 
            document.getElementById("leaflet-map-error").style.display = "none";
            return stations.data.map(
                (station) => new L.LatLng(station.lat, station.lon)
            );
        })
        .catch((e) => {
            var o = document.getElementById("leaflet-map-error");
            o.innerHTML = "Sorry...." + e;
            o.style.display = "";
        });
}
 
function populateAndFitMarkers(map, bounds) {
    removeMarkers(map);
    if (bounds.split(",").length == 2) {
        let [lat, lng] = bounds.split(",");
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        bounds = `${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5}`;
    }
    populateMarkers(map, bounds).then((markerBounds) => {
        let [lat1, lng1, lat2, lng2] = bounds.split(",");
        let mapBounds = L.latLngBounds(
            L.latLng(lat2, lng2),
            L.latLng(lat1, lng1)
        );
        map.fitBounds(mapBounds, { maxZoom: 12, paddingTopLeft: [0, 40] });
    });
}
 
function removeMarkers(map) {
    Object.values(allMarkers).forEach((marker) => map.removeLayer(marker));
    allMarkers = {};
}
 
function getMarkerPopup(markerUID) {
    return getMarkerAQI(markerUID).then((marker) => {
        let info =
            marker.city.name +
            ": AQI " +
            marker.aqi +
            " updated on " +
            new Date(marker.time.v * 1000).toLocaleTimeString() +
            "<br>";
 
        if (marker.city.location) {
            info += "<b>Location</b>: ";
            info += "<small>" + marker.city.location + "</small><br>";
        }
 
        let pollutants = ["pm25", "pm10", "o3", "no2", "so2", "co"];
 
        info += "<b>Pollutants</b>: ";
        for (specie in marker.iaqi) {
            if (pollutants.indexOf(specie) >= 0)
                info += "<u>" + specie + "</u>:" + marker.iaqi[specie].v + " ";
        }
        info += "<br>";
 
        info += "<b>Weather</b>: ";
        for (specie in marker.iaqi) {
            if (pollutants.indexOf(specie) < 0)
                info += "<u>" + specie + "</u>:" + marker.iaqi[specie].v + " ";
        }
        info += "<br>";
 
        info += "<b>Attributions</b>: <small>";
        info += marker.attributions
            .map(
                (attribution) =>
                    "<a target=_ href='" +
                    attribution.url +
                    "'>" +
                    attribution.name +
                    "</a>"
            )
            .join(" - ");
        return info;
    });
}
 
function getMarkerAQI(markerUID) {
    return fetch(
        "https://api.waqi.info/feed/@" + markerUID + "/?token=" + token()
    )
        .then((x) => x.json())
        .then((data) => {
            if (data.status != "ok") throw data.reason;
            return data.data;
        });
}
 
function init() {
    // var map = createMap();
 
    const locations = {
        // "xWestCoast, USA": "41.1, -125",
        Seattle: "47.606000, -122.332000",
        Portland: "44.9, -123",
        "San Francisco": "37.775, -122.419",
        "Los Angeles": "34.052235,-118.243683",
        Beijing: "39.379436,116.091230,40.235643,116.784382",
        // Bucharest:
        //     "44.50858895332098,25.936583232631918,44.389144165939854,26.300222840009447",
        London: "51.69945358064312,-0.5996591366844406,51.314690280921894,0.3879568209963314",
        // Bangalore:
        //     "13.106898860432123,77.38497433246386,12.825861486200223,77.84571346820603",
        // Gdansk: "54.372158,18.638306",
        Paris: "48.864716,2.349014",
        // Seoul: "37.532600,127.024612",
        // Jakarta: "-6.200000,106.816666",
    };
 
    let oldButton;
    function addLocationButton(location, bounds) {
        let button = document.createElement("button");
        button.classList.add("ui", "button", "tiny", "flex-column");
        document.getElementById("leaflet-locations").appendChild(button);
        button.innerHTML = location;
        let activate = () => {
            populateAndFitMarkers(map, bounds);
            if (oldButton) oldButton.classList.remove("primary");
            button.classList.add("primary");
            oldButton = button;
        };
        button.onclick = activate;
        return activate;
    }
 
    Object.keys(locations).forEach((location, idx) => {
        let bounds = locations[location];
        let activate = addLocationButton(location, bounds);
        if (idx == 0) activate();
    });
 
    fetch("https://api.waqi.info/v2/feed/here/?token=" + token())
    // fetch("https://api.waqi.info/v2/feed/?token=56cc1e3308f31fba68b6d55cb20de2638eb44872")
        .then((x) => x.json())
        .then((x) => {
            addLocationButton(x.city.name, x.city.geo.join(","));
        });
}

function token() {
    return "56cc1e3308f31fba68b6d55cb20de2638eb44872"
}
 
init();

// ---^----^----^----^-----^----^----^----^--- \\
// ----- End AQI Area ----- End AQI Area ----- \\
// ---^----^----^----^-----^----^----^----^--- \\



// -v-v-v- Reposition Map -v-v-v- //
function repoMapWestCoast() {
    map.setView(new L.LatLng(41.1, -125), 5);
};

function repoMapSeattle() {
    map.setView(new L.LatLng(47.606, -122.332), 8);
};

function repoMapPDX() {
    map.setView(new L.LatLng(45, -122), 7);
};

function repoMapSF() {
    map.setView(new L.LatLng(37.775, -122.419), 7);
};

function repoMapLA() {
    map.setView(new L.LatLng(33.958, -118.45), 11);
};
// -^-^-^- Reposition Map -^-^-^- //


// -v-v-v- Display Loader -v-v-v- //
const displayLoader = () => {
    loaderContainer.style.display = 'block';
};

const hideLoader = () => {
    loaderContainer.style.display = 'none';
};
// -^-^-^- Display Loader -^-^-^- //


// -v-v-v- Fetch and Place Fire Data -v-v-v- //
let url = 'https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires';
let i = 0;

let firemark1 = 0;
let arrlength = 0;
let fireArray = [];
let firemarker = 0;

const fireicon = new L.icon({
    iconUrl: "./images/fire-icon.png",
    iconSize: [40, 40]
});


function placeMarker() {
    for (let index = 0; index < fireArray.length; index++) {
        const element = fireArray[index];
        console.log(element);

        const lat = fireArray[index].geometry[0].coordinates[1];
        const long = fireArray[index].geometry[0].coordinates[0];
        const title = fireArray[index].title;
        const infolink = fireArray[index].sources[0].url
        const firedate = fireArray[index].geometry[0].date

        console.log(lat,long);
        firemarker = L.marker([lat, long], {icon: fireicon})
            .addTo(map)
            .bindPopup('Name: "' + title + '"<br>' + 'Date: ' + firedate + '<br>' + '<a href="' + infolink + '"target="_blank" rel="noopener noreferrer">Link (new tab) for more information on the "' + title + '"</a>');
    }
}

function getFireData() {
    console.log('getfiredata button fire');
    displayLoader()
    fetch(url)
        .then(response => response.json())
        .then(data => (
            console.log("0-wildfire title: ", data.events[i].title),
            console.log("1", data.events[i]),
            console.log("2", data.events[i].geometry),
            console.log("3", data.events[i].geometry[i].coordinates),
            console.log("4-longitude", data.events[i].geometry[i].coordinates[i]),
            console.log("5-latitude", data.events[i].geometry[i].coordinates[(i + 1)]),

            mylong = data.events[i].geometry[i].coordinates[i],
            mylat = data.events[i].geometry[i].coordinates[(i + 1)],
            mytitle = data.events[i].title,

            firemark1 = L.marker([mylat, mylong]).addTo(map).bindPopup("Most Recent Fire: " + mytitle),

            console.log('OneFire Latitude (mylat): ', mylat),
            console.log('OneFire Longitude: (mylong): ', mylong),
            console.log('For the Above ^ wildfire name (mytitle) is: ', mytitle),

            arrlength = data.events.length,
            console.log('arrlength is:', arrlength),

            fireArray = data.events,
            console.log('fireArray is:', fireArray)

        )
        )
        .then(data => {
            (placeMarker(data));
            hideLoader();
        }
        )
        .catch(error => console.log(error));
};
// -^-^-^- Fetch and Place Fire Data -^-^-^- //


function logFireData() {
    console.log('OneFire Latitude (mylat): ', mylat),
    console.log('OneFire Longitude: (mylong): ', mylong),
    console.log('For the Above ^ wildfire name (mytitle) is: ', mytitle),
    console.log('arrlength is:', arrlength),
    console.log('fireArray is:', fireArray)
}


// -v-v-v- Generate test markers -v-v-v- //
let testmarker = 0;

function addTestMarker() {
    console.log('addtestmarker button fire');
    testmarker = L.marker([40, -122]).addTo(map);
}

function removeTestMarker() {
    console.log('removetestmarker button fire');
    map.removeLayer(testmarker);
}
// -^-^-^- Generate test markers -^-^-^- //



// -v-v-v- Map Section -v-v-v- //
var map = L.map('map').setView([41.1, -125], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// -^-^-^- Map Section -^-^-^- //



AddTestMarker.addEventListener('click', addTestMarker);
RemoveTestMarker.addEventListener('click', removeTestMarker);

GetFireData.addEventListener('click', getFireData);
LogFireData.addEventListener('click', logFireData);

RepoMapWestCoast.addEventListener('click', repoMapWestCoast)
RepoMapSeattle.addEventListener('click', repoMapSeattle)
RepoMapPDX.addEventListener('click', repoMapPDX)
RepoMapSF.addEventListener('click', repoMapSF)
RepoMapLA.addEventListener('click', repoMapLA)


// getFireData();