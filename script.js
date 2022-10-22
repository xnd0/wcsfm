// --------------------------------- \\
// -------- Javascript Page -------- \\
// --------------------------------- \\

const AddTestMarker = document.querySelector('#addtestmarker')
const RemoveTestMarker = document.querySelector('#removetestmarker')


// -v-v-v- Generate test markers -v-v-v- //
let testmarker = 0;

function addTestMarker() {
    console.log('addtestmarker button fire')
    testmarker = L.marker([40, -122]).addTo(map);
}

function removeTestMarker() {
    console.log('removetestmarker button fire')
    map.removeLayer(testmarker)
}
// -^-^-^- Generate test markers -^-^-^- //



// -v-v-v- Map Section -v-v-v- //
var map = L.map('map').setView([41.1, -125], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// -^-^-^- Map Section -^-^-^- //



AddTestMarker.addEventListener('click', addTestMarker)
RemoveTestMarker.addEventListener('click', removeTestMarker)