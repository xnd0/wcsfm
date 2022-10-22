// --------------------------------- \\
// -------- Javascript Page -------- \\
// --------------------------------- \\

const AddTestMarker = document.querySelector('#addtestmarker')
const RemoveTestMarker = document.querySelector('#removetestmarker')

const GetFireData = document.querySelector('#getfiredata')



// -v-v-v- Fetch Fire Data -v-v-v- //

let url = 'https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires';
let i = 0;

let firemark1 = 0;

function getFireData() {
    console.log('getfiredata button fire');

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

            firemark1 = L.marker([mylat, mylong]).addTo(map).bindPopup(mytitle),

            console.log('OneFire Latitude (mylat): ', mylat),
            console.log('OneFire Longitude: (mylong): ', mylong),
            console.log('For the Above ^ wildfire name (mytitle) is: ', mytitle)
        )
        ).catch(error => console.log(error));
};
// -^-^-^- Fetch Fire Data -^-^-^- //


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