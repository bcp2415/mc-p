// Check whether geolocation supported
function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation);
    } else {
        alert ("No geolocation support.");
    }
};

// Save possible destinations to be shown in map
function Location(name, latitude, longitude, zoom) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
    this.map = function() {
        var map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([this.longitude, this.latitude]),
              zoom: this.zoom
            })
          });
    };
}

// Add locations to the locations array

function addLocation(name, lat, long, zoom = 9) {
    // initialize empty array if it doesn't already exit
    if (typeof locations==="undefined") {
        locations = [];
    };

    // add new location to array
    locations.push(new Location(name, lat, long, zoom));
}

addLocation("Paris", 48.8566, 2.3522);
addLocation("Monaco", 43.7384, 7.4246, 10);
addLocation("Cannes", 43.5528, 7.0174, 14);
addLocation("Lyon", 45.7640, 4.8357, 10);
addLocation("Mont Blanc", 45.8326, 6.8652, 10);
addLocation("Montreal", 45.5017, -73.5673);
addLocation("Port au Prince, Haiti", 18.5944, -72.3074);
addLocation("Luxembourg", 49.8153, 6.1296);
addLocation("Brussels, Belgium", 50.8503, 4.3517, 11);
addLocation("Mauritius", 20.3484, 57.5522);
addLocation("Andorra", 42.5063, 1.5218, 11);
addLocation("Geneva", 46.2044, 6.1432, 10);
addLocation("Libreville, Gabon", 0.4162, 9.4673);
addLocation("Kinshasa, Congo", -4.4419, 15.2663);
addLocation("The Seychelles", -4.6796, 55.4920);

// Choose a random item from the list of cities and positions:
var place = Math.round(Math.random() * (locations.length - 1));

// Compute distance from user's location to randomly chosen destination, render distance in UI
function displayLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var km = Math.round(computeDistance(position.coords, locations[place]));
    var distance = document.getElementById("distance");
    var linkOpen = `<a href="https://en.wikipedia.org/wiki/Main_Page" alt="This is a link">`;
    var linkClose = `</a>`;
    distance.innerHTML = `You are only ${km} kilometers from ${linkOpen}${locations[place].name}${linkClose}!`;

    locations[place].map();
};

function displayError(error) {
    var errorTypes = {
        0:  "Unknown error",
        1:  "Permission denied by user",
        2:  "Position is not available",
        3:  "Request timed out"
    };

    var errorMessage = errorTypes[error.code];
    
    if (error.code == 0 || error.code == 2) {
        errorMessage = errorMessage + " " + error.message;
    }

    var div = document.getElementById("location");
    div.innerHTML = errorMessage;
};

function computeDistance(startCoords, destCoords) {
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);

    var Radius = 6371; //radius of the earth in km

    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
                   Math.cos(startLatRads) * Math.cos(destLatRads) *
                    Math.cos(startLongRads - destLongRads)) * Radius;

    return distance;
};

function degreesToRadians(degrees) {
    var radians = (degrees * Math.PI) / 180;
    return radians;
};

function init() {
    makeHeader();
    getMyLocation();
}

init();