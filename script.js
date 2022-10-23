// --------------------------------- \\
// -------- Javascript Page -------- \\
// --------------------------------- \\


const AddTestMarker = document.querySelector('#addtestmarker')
const RemoveTestMarker = document.querySelector('#removetestmarker')

const GetFireData = document.querySelector('#getfiredata')

const RepoMapWestCoast = document.querySelector('#repomapwestcoast')
const RepoMapSeattle = document.querySelector('#repomapseattle')
const RepoMapPDX = document.querySelector('#repomappdx')
const RepoMapSF = document.querySelector('#repomapsf')
const RepoMapLA = document.querySelector('#repomapla')

const loaderContainer = document.querySelector('.loader-container');


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
    map.setView(new L.LatLng(33.958, -118.45), 8);
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
    displayLoader();
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

RepoMapWestCoast.addEventListener('click', repoMapWestCoast)
RepoMapSeattle.addEventListener('click', repoMapSeattle)
RepoMapPDX.addEventListener('click', repoMapPDX)
RepoMapSF.addEventListener('click', repoMapSF)
RepoMapLA.addEventListener('click', repoMapLA)


getFireData();